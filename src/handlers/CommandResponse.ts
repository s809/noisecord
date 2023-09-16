import { InteractionReplyOptions, Message, MessageCollectorOptionsParams, MessageComponentType, MessageEditOptions, MessageCreateOptions, InteractionCollector, MappedInteractionTypes, InteractionEditReplyOptions } from 'discord.js';
import { PreparedTranslation, Translatable } from '../index.js';

/**
 * Abstract instance of response-to-command related data.
 * @public
 */
export abstract class CommandResponse {
    protected _message?: Message;

    /** Edits the message, if possible. */
    abstract replyOrEdit(options: Translatable.Value<string | MessageCreateOptions | MessageEditOptions | InteractionEditReplyOptions | InteractionReplyOptions>): Promise<this>;

    /** Deletes the message, if possible.*/
    abstract delete(): Promise<void>;

    /** Creates collector of message components. */
    abstract createMessageComponentCollector<T extends MessageComponentType>(
        options?: MessageCollectorOptionsParams<T>
    ): InteractionCollector<MappedInteractionTypes[T]>;

    /** Get content of the message, if present. */
    get content() {
        return this._message?.content ?? null;
    }

    /** Get all embeds of the message, or empty array if there are none.*/
    get embeds() {
        return this._message?.embeds ?? null;
    }

    /** Get flags of the message, if present. */
    get flags() {
        return this._message?.flags ?? null;
    }
}
