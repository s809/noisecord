import { Message, MessageReplyOptions, TextBasedChannel } from 'discord.js';
import { Translator } from "../Translator.js";
import { Command } from "../definitions.js";
import { CommandRequest } from "./CommandRequest.js";
import { MessageCommandResponse } from "./MessageCommandResponse.js";

/** 
 * Command request data from a message.
 * @public 
 */
export class MessageCommandRequest<InGuild extends boolean = boolean> extends CommandRequest<InGuild> {
    readonly message: Message;

    /** @internal */
    constructor(command: Command, translator: Translator, message: Message) {
        super(command, translator);

        this.message = message;
    }

    /** Defers the reply, if possible. */
    async deferReply() {
        return this._response = new MessageCommandResponse(this.message.channel);
    }

    /** Replies to the command. */
    async reply(options: string | MessageReplyOptions) {
        return this.sendSeparate(options);
    }

    /** Sends a new message. */
    async sendSeparate(options: string | MessageReplyOptions) {
        if (typeof options === "object") {
            options = { ...options };
            delete (options as MessageReplyOptions & { ephemeral?: boolean }).ephemeral;
        }
        return new MessageCommandResponse(await this.message.channel.send(options));
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
