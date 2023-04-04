import { Guild, GuildMember, If, InteractionReplyOptions, TextBasedChannel, GuildTextBasedChannel, MessageReplyOptions, User, Snowflake, InteractionCollector, CollectedInteraction, MappedInteractionTypes } from 'discord.js';
import { Translator } from "../Translator.js";
import { Command } from "../definitions.js";
import { CommandResponse } from "./CommandResponse.js";

/** 
 * Abstract instance of command related data.
 * @public 
 */
export abstract class CommandRequest<InGuild extends boolean = boolean> {
    /** Response, if a command request was replied. */
    get response() {
        return this._response;
    }
    _response: CommandResponse | null = null;

    /** @internal */
    constructor(readonly command: Command, readonly translator: Translator) { }

    /** Completes with minimal side effects (or with none, if possible). */
    async completeSilently() { };

    /** Defers the reply, if possible. */
    abstract deferReply(ephemeral?: boolean): Promise<CommandResponse>;

    /** Replies to the command request. */
    abstract reply(options: string | InteractionReplyOptions | MessageReplyOptions): Promise<CommandResponse>;

    /** Replies to the command request or sends a new message if it cannot reply. */
    async replyOrSendSeparate(options: InteractionReplyOptions | MessageReplyOptions) {
        return this.reply(options).catch(() => this.sendSeparate(options as MessageReplyOptions));
    }

    /** Sends a new message. */
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
