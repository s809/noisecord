import { InteractionReplyOptions, Message, MessageCollectorOptionsParams, MessageComponentType, MessageEditOptions, TextBasedChannel, WebhookEditMessageOptions, MessageCreateOptions, StageChannel } from 'discord.js';
import { CommandResponse } from "./CommandResponse.js";

export class MessageCommandResponse extends CommandResponse {
    private channel?: TextBasedChannel;

    constructor(message: Message);
    constructor(deferChannel: TextBasedChannel);
    constructor(messageOrDeferChannel: Message | TextBasedChannel) {
        if (messageOrDeferChannel instanceof Message) {
            super(messageOrDeferChannel);
        } else {
            super();
            this.channel = messageOrDeferChannel;
        }
    }

    async edit(options: string | MessageCreateOptions | MessageEditOptions | WebhookEditMessageOptions | InteractionReplyOptions) {
        this.message = this.message
            ? await this.message.edit(options as MessageEditOptions)
            : await (this.channel! as Exclude<TextBasedChannel, StageChannel>).send(options as MessageCreateOptions);
        return this;
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
