import { Guild, GuildMember, If, InteractionReplyOptions, TextBasedChannel, GuildTextBasedChannel, MessageReplyOptions, User, Snowflake, InteractionCollector, CollectedInteraction, MappedInteractionTypes } from 'discord.js';
import { Translator } from '../Translator';
import { Command } from '../definitions';
import { CommandResponse } from './CommandResponse';

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
