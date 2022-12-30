import { CommandInteraction, InteractionReplyOptions, MessageReplyOptions } from 'discord.js';
import { Translator } from '../Translator';
import { Command } from '../definitions';
import { CommandMessage } from './CommandMessage';
import { MessageCommandResponse } from "./MessageCommandResponse";
import { InteractionCommandResponse } from "./InteractionCommandResponse";

export class InteractionCommandMessage<InGuild extends boolean = boolean> extends CommandMessage<InGuild> {
    readonly interaction: CommandInteraction;

    constructor(command: Command, translator: Translator, interaction: CommandInteraction) {
        super(command, translator);

        this.interaction = interaction;
    }

    override async completeSilently() {
        if (this.interaction.replied)
            return;

        await this.interaction.deferReply();
        await this.interaction.deleteReply();
    }

    async deferReply(ephemeral = true) {
        return this._response = new InteractionCommandResponse({
            interaction: this.interaction,
            response: await this.interaction!.deferReply({ ephemeral })
        });
    }

    async reply(options: string | InteractionReplyOptions) {
        return this._response = new InteractionCommandResponse({
            interaction: this.interaction,
            response: await this.interaction.reply({
                ephemeral: true,
                ...(typeof options === "string" ? { content: options } : options)
            } as InteractionReplyOptions),
            message: await this.interaction.fetchReply()
        });
    }

    async sendSeparate(options: string | MessageReplyOptions) {
        return new MessageCommandResponse({
            message: await this.interaction.channel!.send(options),
            deferChannel: this.interaction.channel!
        });
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
