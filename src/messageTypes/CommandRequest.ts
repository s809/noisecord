import { Guild, GuildMember, If, InteractionReplyOptions, TextBasedChannel, GuildTextBasedChannel, MessageReplyOptions, User, Snowflake, InteractionCollector, CollectedInteraction, MappedInteractionTypes } from 'discord.js';
import { Translator } from "../Translator.js";
import { Command } from "../definitions.js";
import { CommandResponse } from "./CommandResponse.js";

/** @public */
export abstract class CommandRequest<InGuild extends boolean = boolean> {
    response: CommandResponse | null = null;

    /** @internal */
    constructor(readonly command: Command, readonly translator: Translator) { }

    async completeSilently() { };

    abstract deferReply(ephemeral?: boolean): Promise<CommandResponse>;

    abstract reply(options: string | InteractionReplyOptions | MessageReplyOptions): Promise<CommandResponse>;

    async replyOrSendSeparate(options: InteractionReplyOptions | MessageReplyOptions) {
        return this.reply(options).catch(() => this.sendSeparate(options as MessageReplyOptions));
    }

    abstract sendSeparate(options: string | MessageReplyOptions): Promise<CommandResponse>;

    abstract get content(): string | null;

    abstract inGuild(): this is CommandRequest<true>;

    // { send: never } is to avoid breaking interaction-ish flow
    // Use sendSeparate() instead
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