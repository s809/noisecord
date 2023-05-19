import { CommandInteraction, InteractionReplyOptions, MessageCollectorOptionsParams, MessageComponentType, MessageEditOptions, MessageCreateOptions, MessageFlags, InteractionEditReplyOptions } from 'discord.js';
import { CommandResponse } from "./CommandResponse.js";

/** @public */
export class InteractionCommandResponse extends CommandResponse {
    private sent = false;

    /** @internal */
    constructor(readonly interaction: CommandInteraction) {
        super();
    }

    async deferReply(ephemeral?: boolean) {
        this.sent = true;
        await this.interaction.deferReply({ ephemeral }).catch(() => { });
        return this;
    }

    /** Replies to interaction or edits it. */
    async replyOrEdit(options: string | InteractionReplyOptions | InteractionEditReplyOptions) {
        const fixedOptions = {
            ephemeral: true,
            ...typeof options === "string" ? { content: options } : options as InteractionReplyOptions,
            fetchReply: true
        } as const;
        
        if (!this.sent) {
            this.sent = true;
            this._message = await this.interaction.reply(fixedOptions)
                .catch(() => this.interaction.followUp(fixedOptions));
            return this;
        }

        this._message = await this.interaction.editReply(fixedOptions)
            .catch(() => this.interaction.followUp(fixedOptions));
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
        if (!this._message)
            throw new Error("Response should be awaited before using this method.");
        return this._message.createMessageComponentCollector(options);
    }
}
