import { CommandInteraction, InteractionEditReplyOptions, InteractionReplyOptions, MessageCollectorOptionsParams, MessageComponentType } from 'discord.js';
import { Translatable } from "../../translations/Translatable.js";
import { CommandResponse } from "../CommandResponse.js";

/** @public */
export class InteractionCommandResponse extends CommandResponse {
    private ephemeral = true;

    private _deferredOrReplied = false;
    get deferredOrReplied() {
        return this._deferredOrReplied;
    }

    private _repliedFully = false;
    get repliedFully() {
        return this._repliedFully;
    }

    /** @internal */
    constructor(readonly interaction: CommandInteraction) {
        super();
    }

    async defer(ephemeral = true) {
        if (this._deferredOrReplied) return this;
        this._deferredOrReplied = true;
        this.ephemeral = ephemeral;

        this._message = await this.interaction.deferReply({
            ephemeral,
            fetchReply: true
        }).catch(() => this._message);
        return this;
    }

    /** Replies to interaction or edits it. */
    async replyOrEdit(options: Translatable.Value<string | InteractionReplyOptions | InteractionEditReplyOptions>) {
        const translatedOptions = Translatable.translateValue(options);

        const fixedOptions = {
            // if this is a first message, [ephemeral] will be set to what value it was deferred with
            // for second and further, it is true by default
            ephemeral: this.ephemeral || this._repliedFully,
            ...typeof translatedOptions === "string" ? { content: translatedOptions } : translatedOptions as InteractionReplyOptions
        } as const;

        if (!this._deferredOrReplied) {
            this._deferredOrReplied = true;
            this._repliedFully = true;
            this.ephemeral = fixedOptions.ephemeral;

            this._message = await this.interaction.reply({
                ...fixedOptions,
                fetchReply: true
            });
            return this;
        }

        if (!this._repliedFully) {
            this._repliedFully = true;
            this._message = await this.interaction.followUp(fixedOptions);
        } else {
            this._message = await this.interaction.editReply(fixedOptions);
        }

        return this;
    }

    /**
     * Sends a follow up message.
     * If interaction is not replied to fully, throws an error.
     */
    async followUpForce(options: Translatable.Value<string | InteractionReplyOptions>) {
        const translatedOptions = Translatable.translateValue(options);

        if (!this._repliedFully)
            throw new Error("Request must receive a full response before sending follow ups.")

        const fixedOptions = {
            ephemeral: true,
            ...typeof translatedOptions === "string" ? { content: translatedOptions } : translatedOptions as InteractionReplyOptions
        } as const;

        return this.interaction.followUp(fixedOptions);
    }

    /** Deletes the message, if possible.*/
    async delete() {
        if (!this._deferredOrReplied)
            await this.defer();

        if (!this._message) return;
        this._message = undefined;

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
