import { CommandInteraction, InteractionReplyOptions, Message } from 'discord.js';
import { Translator } from "../../Translator.js";
import { Command, ContextMenuCommand } from "../../definitions.js";
import { CommandRequest } from "../CommandRequest.js";
import { InteractionCommandResponse } from "./InteractionCommandResponse.js";

/** 
 * Command request data from an interaction.
 * @public 
 */
export class InteractionCommandRequest<CommandType extends Command | ContextMenuCommand, InGuild extends boolean = boolean> extends CommandRequest<InGuild, InteractionCommandResponse> {
    /** @internal */
    constructor(readonly command: CommandType, translator: Translator, readonly interaction: CommandInteraction) {
        super(translator, new InteractionCommandResponse(interaction));
        this.interaction = interaction;
    }

    /** Completes with minimal side effects (or with none, if possible). */
    async completeSilently() {
        if (!this.interaction.deferred && !this.interaction.replied)
            await this.interaction.deferReply({ ephemeral: true });
        await this.interaction.deleteReply().catch(() => { });
    }

    /** Defers the reply, if possible. */
    async deferReply(ephemeral = true) {
        return this.response.deferReply(ephemeral);
    }

    /** Replies to the command. */
    async replyOrEdit(options: string | InteractionReplyOptions) {
        return this.response?.replyOrEdit(options);
    }

    /** 
     * Sends a follow up message.
     * If interaction is not replied to fully, throws an error.
     */
    async followUpForce(options: string | InteractionReplyOptions) {
        return await this.response.followUpForce(options) as Message<InGuild>;
    }

    inGuild(): this is InteractionCommandRequest<CommandType, true> {
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
