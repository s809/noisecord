import { InteractionReplyOptions, InteractionResponse, Message, MessageCollectorOptionsParams, MessageComponentType, MessageEditOptions, WebhookEditMessageOptions, MessageCreateOptions } from 'discord.js';

export abstract class CommandResponse {
    protected message?: Message;
    get replyCompleted() {
        return Boolean(this.message);
    }

    abstract edit(options: string | MessageCreateOptions | MessageEditOptions | WebhookEditMessageOptions | InteractionReplyOptions): Promise<void>;

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
}
