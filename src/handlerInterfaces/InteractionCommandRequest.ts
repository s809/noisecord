import { CommandInteraction, InteractionReplyOptions, Message, MessageReplyOptions } from 'discord.js';
import { Translator } from "../Translator.js";
import { Command } from "../definitions.js";
import { CommandRequest } from "./CommandRequest.js";
import { MessageCommandResponse } from "./MessageCommandResponse.js";
import { InteractionCommandResponse } from "./InteractionCommandResponse.js";

/** 
 * Command request data from an interaction.
 * @public 
 */
export class InteractionCommandRequest<InGuild extends boolean = boolean> extends CommandRequest<InGuild> {
    /** @internal */
    constructor(command: Command, translator: Translator, readonly interaction: CommandInteraction) {
        super(command, translator);
        this.interaction = interaction;
    }

    /** Completes with minimal side effects (or with none, if possible). */
    override async completeSilently() {
        if (!this.interaction.deferred && !this.interaction.replied)
            await this.interaction.deferReply({ ephemeral: true });
        await this.interaction.deleteReply().catch(() => { });
    }

    /** Defers the reply, if possible. */
    async deferReply(ephemeral = true) {
        return this._response ??= new InteractionCommandResponse(
            this.interaction,
            this.interaction.deferReply({
                ephemeral,
                fetchReply: true,
            })
        );
    }

    /** Replies to the command. */
    async reply(options: string | InteractionReplyOptions) {
        return this._response = this.response
            ? await this.response.edit(options)
            : new InteractionCommandResponse(
                this.interaction,
                this.interaction.reply({
                    ephemeral: true,
                    ...typeof options === "string" ? { content: options } : options,
                    fetchReply: true
                } as const)
            );
    }

    /** Sends a new message. */
    async sendSeparate(options: string | MessageReplyOptions) {
        return new MessageCommandResponse(await this.interaction.channel!.send(options));
    }

    get content() {
        return null;
    }

    inGuild(): this is InteractionCommandRequest<true> {
        return this.interaction.inGuild();
    }

    get channel(): CommandRequest<InGuild>["channel"] {
        return this.interaction.channel as any;
    }

    get guild(): CommandRequest<InGuild>["guild"] {
        return this.interaction.guild as any;
    }

    get member(): CommandRequest<InGuild>["member"] {
        return this.interaction.member as any;
    }

    get author() {
        return this.interaction.user;
    }
}
