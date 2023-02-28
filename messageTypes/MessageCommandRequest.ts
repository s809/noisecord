import { Message, MessageReplyOptions, StageChannel, TextBasedChannel } from 'discord.js';
import { Translator } from "../Translator.js";
import { Command } from "../definitions.js";
import { CommandRequest } from "./CommandRequest.js";
import { MessageCommandResponse } from "./MessageCommandResponse.js";

export class MessageCommandRequest<InGuild extends boolean = boolean> extends CommandRequest<InGuild> {
    readonly message: Message;

    constructor(command: Command, translator: Translator, message: Message) {
        super(command, translator);

        this.message = message;
    }

    async deferReply() {
        return this.response = new MessageCommandResponse(this.message.channel);
    }

    async reply(options: string | MessageReplyOptions) {
        return this.sendSeparate(options as MessageReplyOptions);
    }

    async sendSeparate(options: string | MessageReplyOptions) {
        options = structuredClone(options);
        delete (options as any).ephemeral;
        return new MessageCommandResponse(await (this.message.channel as Exclude<TextBasedChannel, StageChannel>).send(options));
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
