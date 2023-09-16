import { InteractionEditReplyOptions, InteractionReplyOptions, Message, MessageCreateOptions, MessageEditOptions } from 'discord.js';
import { Command } from "../../interfaces/Command.js";
import { Translatable } from '../../translations/PreparedTranslation.js';
import { Translator } from "../../translations/Translator.js";
import { CommandRequest } from "../CommandRequest.js";
import { MessageCommandResponse } from "./MessageCommandResponse.js";

/**
 * Command request data from a message.
 * @public
 */
export class MessageCommandRequest<InGuild extends boolean = boolean> extends CommandRequest<InGuild, MessageCommandResponse> {
    /** @internal */
    constructor(readonly command: Command, translator: Translator, readonly message: Message, prefix: string) {
        super(translator, prefix, new MessageCommandResponse(message.channel));
    }

    /** Replies to the command. */
    async replyOrEdit(options: Translatable.Value<string | MessageCreateOptions | MessageEditOptions | InteractionEditReplyOptions | InteractionReplyOptions>) {
        return this.response.replyOrEdit(options);
    }

    get content() {
        return this.message.content;
    }

    inGuild(): this is MessageCommandRequest<true> {
        return this.message.inGuild();
    }

    get channel(): CommandRequest<InGuild>["channel"] {
        return this.message.channel as any;
    }

    get guild(): CommandRequest<InGuild>["guild"] {
        return this.message.guild ?? null as any;
    }

    get member(): CommandRequest<InGuild>["member"] {
        return this.message.member ?? null as any;
    }

    get author() {
        return this.message.author;
    }
}
