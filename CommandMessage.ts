import { CommandInteraction, Guild, GuildMember, If, InteractionReplyOptions, InteractionResponse, Message, MessageCollectorOptionsParams, MessageComponentType, MessageEditOptions, TextBasedChannel, WebhookEditMessageOptions, GuildTextBasedChannel, MessageCreateOptions, MessageReplyOptions, User, Snowflake, InteractionCollector, CollectedInteraction, MappedInteractionTypes } from 'discord.js';
import { Translator } from './Translator';
import { Command } from './definitions';

export abstract class CommandMessage<InGuild extends boolean = boolean> {
    readonly command: Command;
    readonly translator: Translator;
    
    get response() {
        return this._response;
    }
    _response: CommandResponse | null = null;

    constructor(command: Command, translator: Translator) {
        this.command = command;
        this.translator = translator;
    }

    async completeSilently() { };

    abstract deferReply(ephemeral?: boolean): Promise<CommandResponse>;

    abstract reply(options: string | InteractionReplyOptions | MessageReplyOptions): Promise<CommandResponse>;

    async replyOrSendSeparate(options: InteractionReplyOptions | MessageReplyOptions) {
        return this.reply(options).catch(() => this.sendSeparate(options as MessageReplyOptions));
    }

    abstract sendSeparate(options: string | MessageReplyOptions): Promise<CommandResponse>;

    abstract get content(): string | null;

    abstract inGuild(): this is CommandMessage<true>;

    // {send: never} is to avoid breaking interaction-ish flow
    abstract get channel(): If<InGuild, GuildTextBasedChannel, TextBasedChannel> & { send: never };

    get channelId() {
        return this.channel.id;
    }

    abstract get guild(): If<InGuild, Guild>;

    get guildId(): If<InGuild, Snowflake> {
        return this.guild?.id ?? null as any;
    }

    abstract get member(): If<InGuild, GuildMember>;

    abstract get author(): User;
}

export class InteractionCommandMessage<InGuild extends boolean = boolean> extends CommandMessage<InGuild> {
    readonly interaction: CommandInteraction;

    constructor(command: Command, translator: Translator, interaction: CommandInteraction) {
        super(command, translator);
        
        this.interaction = interaction;
    }

    override async completeSilently() {
        if (this.interaction.replied) return;

        await this.interaction.deferReply();
        await this.interaction.deleteReply();
    }

    async deferReply(ephemeral = true) {
        return this._response = new InteractionCommandResponse({
            interaction: this.interaction,
            response: await this.interaction!.deferReply({ ephemeral })
        });
    }

    async reply(options: string | InteractionReplyOptions) {
        return this._response = new InteractionCommandResponse({
            interaction: this.interaction,
            response: await this.interaction.reply({
                ephemeral: true,
                ...(typeof options === "string" ? { content: options } : options)
            } as InteractionReplyOptions),
            message: await this.interaction.fetchReply()
        });
    }

    async sendSeparate(options: string | MessageReplyOptions) {
        return new MessageCommandResponse({
            message: await this.interaction.channel!.send(options),
            deferChannel: this.interaction.channel!
        });
    }

    get content() {
        return null;
    }

    inGuild(): this is InteractionCommandMessage<true> {
        return this.interaction.inGuild();
    }

    get channel(): CommandMessage<InGuild>["channel"] {
        return this.interaction.channel as any;
    }

    get guild(): CommandMessage<InGuild>["guild"] {
        return this.interaction.guild as any;
    }

    get member(): CommandMessage<InGuild>["member"] {
        return this.interaction.member as any;
    }

    get author() {
        return this.interaction.user;
    }
}

export class MessageCommandMessage<InGuild extends boolean = boolean> extends CommandMessage<InGuild> {
    readonly message: Message;

    constructor(command: Command, translator: Translator, message: Message) {
        super(command, translator);

        this.message = message;
    }

    async deferReply() {
        return this._response = new MessageCommandResponse({
            deferChannel: this.message!.channel,
        });
    }

    async reply(options: string | MessageReplyOptions) {
        return this.sendSeparate(options as MessageReplyOptions);
    }

    async sendSeparate(options: string | MessageReplyOptions) {
        return new MessageCommandResponse({
            message: await this.message.channel.send(options),
            deferChannel: this.message.channel
        });
    }

    get content() {
        return this.message.content;
    }

    inGuild(): this is MessageCommandMessage<true> {
        return this.message.inGuild();
    }

    get channel(): CommandMessage<InGuild>["channel"] {
        return this.message.channel as any;
    }

    get guild(): CommandMessage<InGuild>["guild"] {
        return this.message.guild ?? null as any;
    }

    get member(): CommandMessage<InGuild>["member"] {
        return this.message.member ?? null as any;
    }

    get author() {
        return this.message.author;
    }
}

export abstract class CommandResponse {
    protected message?: Message;
    get replyCompleted() {
        return Boolean(this.message);
    }

    abstract edit(options: string | MessageCreateOptions | MessageEditOptions | WebhookEditMessageOptions | InteractionReplyOptions): Promise<void>;

    abstract delete(): Promise<void>;

    abstract createMessageComponentCollector<T extends MessageComponentType>(
        options?: MessageCollectorOptionsParams<T>,
    ): ReturnType<(Message | InteractionResponse)["createMessageComponentCollector"]>;

    get content() {
        return this.message?.content;
    }

    get embeds() {
        return this.message?.embeds;
    }
}

export class InteractionCommandResponse extends CommandResponse {
    readonly interaction: CommandInteraction;
    readonly response: InteractionResponse;

    constructor({
        interaction,
        response,
        message
    }: {
        interaction: CommandInteraction;
        response: InteractionResponse;
        message?: Message;
    }) {
        super();
        this.interaction = interaction;
        this.response = response;
        this.message = message;
    }

    async edit(options: string | MessageCreateOptions | MessageEditOptions | WebhookEditMessageOptions | InteractionReplyOptions) {
        if (this.interaction.deferred)
            this.message = await this.interaction.followUp(options as InteractionReplyOptions);
        else
            this.message = await this.interaction.editReply(options as WebhookEditMessageOptions);
    }

    async delete() {
        await this.interaction.deleteReply();
    }

    createMessageComponentCollector<T extends MessageComponentType>(
        options?: MessageCollectorOptionsParams<T>,
    ) {
        return this.response.createMessageComponentCollector(options);
    }
}

export class MessageCommandResponse extends CommandResponse {
    private channel: TextBasedChannel;

    constructor({
        message,
        deferChannel,
    }: {
        message?: Message;
        deferChannel: TextBasedChannel;
    }) {
        super();
        this.message = message;
        this.channel = deferChannel;
    }

    async edit(options: string | MessageCreateOptions | MessageEditOptions | WebhookEditMessageOptions | InteractionReplyOptions) {
        if (!this.message) {
            this.message = await this.channel.send(options as MessageCreateOptions);
        } else {
            this.message = await this.message!.edit(options as MessageEditOptions);
        }
    }

    async delete() {
        await this.message?.delete().catch(() => { });
    }

    createMessageComponentCollector<T extends MessageComponentType>(
        options?: MessageCollectorOptionsParams<T>,
    ) {
        return this.message!.createMessageComponentCollector(options);
    }
}
