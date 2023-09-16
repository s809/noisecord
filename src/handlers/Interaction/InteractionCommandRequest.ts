import { CommandInteraction, InteractionEditReplyOptions, InteractionReplyOptions, Message } from 'discord.js';
import { Command } from "../../interfaces/Command.js";
import { ContextMenuCommand } from '../../interfaces/ContextMenuCommand.js';
import { InGuildCacheType, InteractionInGuild } from '../../interfaces/common.js';
import { Translatable } from "../../translations/Translatable.js";
import { Translator } from "../../translations/Translator.js";
import { CommandRequest } from "../CommandRequest.js";
import { InteractionCommandResponse } from "./InteractionCommandResponse.js";

/**
 * Command request data from an interaction.
 * @public
 */
export class InteractionCommandRequest<
    CommandType extends Command | ContextMenuCommand,
    InteractionType extends CommandInteraction
> extends CommandRequest<
    InteractionType extends CommandInteraction<InGuildCacheType> ? true : false,
    InteractionCommandResponse
> {
    /** @internal */
    constructor(readonly command: CommandType, translator: Translator, readonly interaction: InteractionType) {
        super(translator, "/", new InteractionCommandResponse(interaction));
        this.interaction = interaction;
    }

    /** Defers the reply, if possible. */
    async deferReply(ephemeral = true) {
        return this.response.defer(ephemeral);
    }

    /** Replies to the command. */
    async replyOrEdit(options: Translatable.Value<string | InteractionReplyOptions | InteractionEditReplyOptions>) {
        return this.response?.replyOrEdit(options);
    }

    /**
     * Sends a follow up message.
     * If interaction is not replied to fully, throws an error.
     */
    async followUpForce(options: Translatable.Value<string | InteractionReplyOptions>) {
        return await this.response.followUpForce(options) as Message<InteractionInGuild<InteractionType>>;
    }

    inGuild(): this is InteractionCommandRequest<CommandType, CommandInteraction<InGuildCacheType>> {
        return this.interaction.inGuild();
    }

    get channel(): CommandRequest<InteractionInGuild<InteractionType>>["channel"] {
        return this.interaction.channel as any;
    }

    get guild(): CommandRequest<InteractionInGuild<InteractionType>>["guild"] {
        return this.interaction.guild as any;
    }

    get member(): CommandRequest<InteractionInGuild<InteractionType>>["member"] {
        return this.interaction.member as any;
    }

    get author() {
        return this.interaction.user;
    }
}
