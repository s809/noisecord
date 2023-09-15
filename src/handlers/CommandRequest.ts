import { Guild, GuildMember, If, InteractionReplyOptions, TextBasedChannel, GuildTextBasedChannel, MessageReplyOptions, User, Snowflake } from 'discord.js';
import { Translator } from "../translations/Translator.js";
import { CommandResponse } from "./CommandResponse.js";
import { PreparedTranslation } from '../translations/PreparedTranslation.js';

/**
 * Abstract instance of command related data.
 * @public
 */
export abstract class CommandRequest<InGuild extends boolean = boolean, Response extends CommandResponse = CommandResponse> {
    /** @internal */
    constructor(
        readonly translator: Translator,
        readonly prefix: string,
        /** Response object, which is filled when a command request is replied. */
        readonly response: Response
    ) { }

    /** Replies to the command request. */
    abstract replyOrEdit(options: PreparedTranslation.Translatable<string | InteractionReplyOptions | MessageReplyOptions>): Promise<Response>;

    abstract inGuild(): this is CommandRequest<true, Response>;

    abstract get channel(): If<InGuild, GuildTextBasedChannel, TextBasedChannel>;

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
