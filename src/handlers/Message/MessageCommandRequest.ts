import { Message, MessageReplyOptions, TextBasedChannel } from 'discord.js';
import { Translator } from "../../Translator.js";
import { Command } from "../../definitions/Command.js";
import { CommandRequest } from "../CommandRequest.js";
import { MessageCommandResponse } from "./MessageCommandResponse.js";

/** 
 * Command request data from a message.
 * @public 
 */
export class MessageCommandRequest<InGuild extends boolean = boolean> extends CommandRequest<InGuild, MessageCommandResponse> {
    /** @internal */
    constructor(readonly command: Command, translator: Translator, readonly message: Message) {
        super(translator, new MessageCommandResponse(message.channel));
    }

    /** Replies to the command. */
    async replyOrEdit(options: string | MessageReplyOptions) {
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
