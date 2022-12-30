import { CommandInteraction, InteractionReplyOptions, InteractionResponse, Message, MessageCollectorOptionsParams, MessageComponentType, MessageEditOptions, WebhookEditMessageOptions, MessageCreateOptions } from 'discord.js';
import { CommandResponse } from './CommandResponse';

export class InteractionCommandResponse extends CommandResponse {
    readonly interaction: CommandInteraction;
    readonly response: InteractionResponse;

    constructor({
        interaction, response, message
    }: {
        interaction: CommandInteraction;
        response: InteractionResponse;
        message?: Message;
    }) {
        super();
        this.interaction = interaction;
        this.response = response;
        this.message = message;
    }

    async edit(options: string | MessageCreateOptions | MessageEditOptions | WebhookEditMessageOptions | InteractionReplyOptions) {
        if (this.interaction.deferred)
            this.message = await this.interaction.followUp(options as InteractionReplyOptions);

        else
            this.message = await this.interaction.editReply(options as WebhookEditMessageOptions);
    }

    async delete() {
        await this.interaction.deleteReply();
    }

    createMessageComponentCollector<T extends MessageComponentType>(
        options?: MessageCollectorOptionsParams<T>
    ) {
        return this.response.createMessageComponentCollector(options);
    }
}
