import { InteractionReplyOptions, InteractionResponse, Message, MessageCollectorOptionsParams, MessageComponentType, MessageEditOptions, WebhookEditMessageOptions, MessageCreateOptions } from 'discord.js';

export abstract class CommandResponse {
    constructor(protected message?: Message) { }

    abstract edit(options: string | MessageCreateOptions | MessageEditOptions | WebhookEditMessageOptions | InteractionReplyOptions): Promise<this>;

    abstract delete(): Promise<void>;

    abstract createMessageComponentCollector<T extends MessageComponentType>(
        options?: MessageCollectorOptionsParams<T>
    ): ReturnType<(Message | InteractionResponse)["createMessageComponentCollector"]>;

    get content() {
        return this.message?.content;
    }

    get embeds() {
        return this.message?.embeds;
    }

    get flags() {
        return this.message?.flags;
    }
}
