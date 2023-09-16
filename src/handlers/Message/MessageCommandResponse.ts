import { InteractionEditReplyOptions, InteractionReplyOptions, Message, MessageCollectorOptionsParams, MessageComponentType, MessageCreateOptions, MessageEditOptions, TextBasedChannel } from 'discord.js';
import { Translatable } from "../../translations/Translatable.js";
import { CommandResponse } from "../CommandResponse.js";

/** @public */
export class MessageCommandResponse extends CommandResponse {
    private messagePromise?: Promise<Message>;

    /** @internal */
    constructor(private channel: TextBasedChannel) {
        super();
    }

    /** Edits the message, if possible. */
    async replyOrEdit(options: Translatable.Value<string | MessageCreateOptions | MessageEditOptions | InteractionEditReplyOptions | InteractionReplyOptions>) {
        const translatedOptions = Translatable.translateValue(options);

        if (!this.messagePromise) {
            this.messagePromise = this.channel.send(translatedOptions as MessageCreateOptions);
            this._message = await this.messagePromise;
            return this;
        }

        await this.messagePromise;
        this._message = await this._message!.edit(translatedOptions as MessageEditOptions);
        return this;
    }

    /** Deletes the message, if possible.*/
    async delete() {
        await this._message?.delete().catch(() => { });
    }

    /** Creates collector of message components. */
    createMessageComponentCollector<T extends MessageComponentType>(
        options?: MessageCollectorOptionsParams<T>
    ) {
        return this._message!.createMessageComponentCollector(options);
    }
}
