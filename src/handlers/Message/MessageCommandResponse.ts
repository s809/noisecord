import { InteractionReplyOptions, Message, MessageCollectorOptionsParams, MessageComponentType, MessageEditOptions, TextBasedChannel, MessageCreateOptions, InteractionEditReplyOptions } from 'discord.js';
import { CommandResponse } from "../CommandResponse.js";

/** @public */
export class MessageCommandResponse extends CommandResponse {
    private messagePromise?: Promise<Message>;

    /** @internal */
    constructor(private channel: TextBasedChannel) {
        super();
    }

    /** Edits the message, if possible. */
    async replyOrEdit(options: string | MessageCreateOptions | MessageEditOptions | InteractionEditReplyOptions | InteractionReplyOptions) {
        if (!this.messagePromise) {
            await (this.messagePromise = this.channel.send(options as MessageCreateOptions));
            return this;
        }
        
        await this.messagePromise;
        this._message = await this._message!.edit(options as MessageEditOptions);
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
