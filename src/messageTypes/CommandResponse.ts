import { InteractionReplyOptions, Message, MessageCollectorOptionsParams, MessageComponentType, MessageEditOptions, WebhookEditMessageOptions, MessageCreateOptions, InteractionCollector, MappedInteractionTypes } from 'discord.js';

/** @public */
export abstract class CommandResponse {
    /** @internal */
    constructor(protected message?: Message) { }

    abstract edit(options: string | MessageCreateOptions | MessageEditOptions | WebhookEditMessageOptions | InteractionReplyOptions): Promise<this>;

    abstract delete(): Promise<void>;

    abstract createMessageComponentCollector<T extends MessageComponentType>(
        options?: MessageCollectorOptionsParams<T>
    ): InteractionCollector<MappedInteractionTypes[T]>;

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
