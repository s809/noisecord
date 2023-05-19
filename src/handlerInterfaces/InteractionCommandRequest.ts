import { CommandInteraction, InteractionReplyOptions, Message, MessageReplyOptions } from 'discord.js';
import { Translator } from "../Translator.js";
import { Command } from "../definitions.js";
import { CommandRequest } from "./CommandRequest.js";
import { InteractionCommandResponse } from "./InteractionCommandResponse.js";

/** 
 * Command request data from an interaction.
 * @public 
 */
export class InteractionCommandRequest<InGuild extends boolean = boolean> extends CommandRequest<InGuild, InteractionCommandResponse> {
    /** @internal */
    constructor(command: Command, translator: Translator, readonly interaction: CommandInteraction) {
        super(command, translator, new InteractionCommandResponse(interaction));
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
        return this.response.deferReply(ephemeral).catch(() => this.response);
    }

    /** Replies to the command. */
    async reply(options: string | InteractionReplyOptions) {
        return this.response?.replyOrEdit(options);
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
