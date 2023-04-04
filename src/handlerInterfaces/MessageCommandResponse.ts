import { InteractionReplyOptions, Message, MessageCollectorOptionsParams, MessageComponentType, MessageEditOptions, TextBasedChannel, MessageCreateOptions, InteractionEditReplyOptions } from 'discord.js';
import { CommandResponse } from "./CommandResponse.js";

/** @public */
export class MessageCommandResponse extends CommandResponse {
    private channel?: TextBasedChannel;

    /** @internal */
    constructor(message: Message);
    /** @internal */
    constructor(deferChannel: TextBasedChannel);
    /** @internal */
    constructor(messageOrDeferChannel: Message | TextBasedChannel) {
        if (messageOrDeferChannel instanceof Message) {
            super(messageOrDeferChannel);
        } else {
            super();
            this.channel = messageOrDeferChannel;
        }
    }

    /** Edits the message, if possible. */
    async edit(options: string | MessageCreateOptions | MessageEditOptions | InteractionEditReplyOptions | InteractionReplyOptions) {
        this.message = this.message
            ? await this.message.edit(options as MessageEditOptions)
            : await this.channel!.send(options as MessageCreateOptions);
        return this;
    }

    /** Deletes the message, if possible.*/
    async delete() {
        await this.message?.delete().catch(() => { });
    }

    /** Creates collector of message components. */
    createMessageComponentCollector<T extends MessageComponentType>(
        options?: MessageCollectorOptionsParams<T>
    ) {
        return this.message!.createMessageComponentCollector(options);
    }
}
