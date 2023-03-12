import { CommandInteraction, InteractionReplyOptions, Message, MessageCollectorOptionsParams, MessageComponentType, MessageEditOptions, WebhookEditMessageOptions, MessageCreateOptions, MessageFlags } from 'discord.js';
import { CommandResponse } from "./CommandResponse.js";

/** @public */
export class InteractionCommandResponse extends CommandResponse {
    /** @internal */
    constructor(readonly interaction: CommandInteraction, message: Message) {
        super(message);
    }

    /** Edits the message, if possible. */
    async edit(options: string | MessageCreateOptions | MessageEditOptions | WebhookEditMessageOptions | InteractionReplyOptions) {
        this.message = this.message!.flags.has(MessageFlags.Loading)
            ? await this.interaction.followUp(options as InteractionReplyOptions)
            : await this.interaction.editReply(options as WebhookEditMessageOptions);
        return this;
    }

    /** Deletes the message, if possible.*/
    async delete() {
        await this.interaction.deleteReply();
    }

    /** Creates collector of message components. */
    createMessageComponentCollector<T extends MessageComponentType>(
        options?: MessageCollectorOptionsParams<T>
    ) {
        return this.message!.createMessageComponentCollector(options);
    }
}
