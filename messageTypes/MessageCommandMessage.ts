import { Message, MessageReplyOptions } from 'discord.js';
import { Translator } from '../Translator';
import { Command } from '../definitions';
import { CommandMessage } from './CommandMessage';
import { MessageCommandResponse } from "./MessageCommandResponse";

export class MessageCommandMessage<InGuild extends boolean = boolean> extends CommandMessage<InGuild> {
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
        return new MessageCommandResponse(await this.message.channel.send(options));
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
