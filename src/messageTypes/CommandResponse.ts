import { InteractionReplyOptions, Message, MessageCollectorOptionsParams, MessageComponentType, MessageEditOptions, WebhookEditMessageOptions, MessageCreateOptions, InteractionCollector, MappedInteractionTypes } from 'discord.js';

/** 
 * Abstract instance of response-to-command related data.
 * @public 
 */
export abstract class CommandResponse {
    /** @internal */
    constructor(protected message?: Message) { }
    
    /** Edits the message, if possible. */
    abstract edit(options: string | MessageCreateOptions | MessageEditOptions | WebhookEditMessageOptions | InteractionReplyOptions): Promise<this>;

    /** Deletes the message, if possible.*/
    abstract delete(): Promise<void>;

    /** Creates collector of message components. */
    abstract createMessageComponentCollector<T extends MessageComponentType>(
        options?: MessageCollectorOptionsParams<T>
    ): InteractionCollector<MappedInteractionTypes[T]>;

    /** Get content of the message, if present. */
    get content() {
        return this.message?.content;
    }

    /** Get all embeds of the message, or empty array if there are none.*/
    get embeds() {
        return this.message?.embeds;
    }

    /** Get flags of the message, if present. */
    get flags() {
        return this.message?.flags;
    }
}
