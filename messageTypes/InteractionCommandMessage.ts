import { CommandInteraction, InteractionReplyOptions, Message, MessageReplyOptions } from 'discord.js';
import { Translator } from '../Translator';
import { Command } from '../definitions';
import { CommandMessage } from './CommandMessage';
import { MessageCommandResponse } from "./MessageCommandResponse";
import { InteractionCommandResponse } from "./InteractionCommandResponse";

export class InteractionCommandMessage<InGuild extends boolean = boolean> extends CommandMessage<InGuild> {
    constructor(command: Command, translator: Translator, readonly interaction: CommandInteraction) {
        super(command, translator);
        this.interaction = interaction;
    }

    override async completeSilently() {
        if (!this.interaction.deferred && !this.interaction.replied)
            await this.interaction.deferReply({ ephemeral: true });
        await this.interaction.deleteReply().catch(() => { });
    }

    async deferReply(ephemeral = true) {
        return this.response ??= new InteractionCommandResponse(
            this.interaction,
            await this.interaction.deferReply({
                ephemeral,
                fetchReply: true,
            })
        );
    }

    async reply(options: string | InteractionReplyOptions) {
        return this.response = this.response
            ? await this.response.edit(options)
            : new InteractionCommandResponse(
                this.interaction,
                await this.interaction.reply({
                    ephemeral: true,
                    ...typeof options === "string" ? { content: options } : options,
                    fetchReply: true
                } as InteractionReplyOptions) as unknown as Message
            );
    }

    async sendSeparate(options: string | MessageReplyOptions) {
        return new MessageCommandResponse(await this.interaction.channel!.send(options));
    }

    get content() {
        return null;
    }

    inGuild(): this is InteractionCommandMessage<true> {
        return this.interaction.inGuild();
    }

    get channel(): CommandMessage<InGuild>["channel"] {
        return this.interaction.channel as any;
    }

    get guild(): CommandMessage<InGuild>["guild"] {
        return this.interaction.guild as any;
    }

    get member(): CommandMessage<InGuild>["member"] {
        return this.interaction.member as any;
    }

    get author() {
        return this.interaction.user;
    }
}
