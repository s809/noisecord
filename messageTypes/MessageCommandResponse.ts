import { InteractionReplyOptions, Message, MessageCollectorOptionsParams, MessageComponentType, MessageEditOptions, TextBasedChannel, WebhookEditMessageOptions, MessageCreateOptions } from 'discord.js';
import { CommandResponse } from './CommandResponse';

export class MessageCommandResponse extends CommandResponse {
    private channel: TextBasedChannel;

    constructor({
        message, deferChannel,
    }: {
        message?: Message;
        deferChannel: TextBasedChannel;
    }) {
        super();
        this.message = message;
        this.channel = deferChannel;
    }

    async edit(options: string | MessageCreateOptions | MessageEditOptions | WebhookEditMessageOptions | InteractionReplyOptions) {
        if (!this.message) {
            this.message = await this.channel.send(options as MessageCreateOptions);
        } else {
            this.message = await this.message!.edit(options as MessageEditOptions);
        }
    }

    async delete() {
        await this.message?.delete().catch(() => { });
    }

    createMessageComponentCollector<T extends MessageComponentType>(
        options?: MessageCollectorOptionsParams<T>
    ) {
        return this.message!.createMessageComponentCollector(options);
    }
}
