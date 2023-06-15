import { ContextMenuCommandInteraction, CacheType, ApplicationCommandType, UserContextMenuCommandInteraction, MessageContextMenuCommandInteraction, Snowflake, UserApplicationCommandData, MessageApplicationCommandData } from "discord.js";
import { InteractionCommandRequest } from "../handlers/Interaction/InteractionCommandRequest.js";
import { AllowDMsCacheType } from "./common.js";

/** @public */
export type ContextMenuInteractionType = ContextMenuCommandInteraction["commandType"];

/** @public */
export interface ContextMenuCommandDefinition<InteractionType extends ContextMenuInteractionType = ContextMenuInteractionType, AllowDMs extends boolean = boolean> {
    key: string;
    type: InteractionType;
    allowDMs?: AllowDMs;
    handler: (interaction: InteractionCommandRequest<
        ContextMenuCommand,
        ContextMenuTypeToInteraction<AllowDMsCacheType<AllowDMs>>[InteractionType]
    >) => void;
}

/** @public */
export interface ContextMenuTypeToInteraction<Cached extends CacheType> {
    [ApplicationCommandType.User]: UserContextMenuCommandInteraction<Cached>;
    [ApplicationCommandType.Message]: MessageContextMenuCommandInteraction<Cached>;
}

/** @public */
export interface ContextMenuCommand extends Required<ContextMenuCommandDefinition> {
    appCommandId: Snowflake | null;
    appCommandData: UserApplicationCommandData | MessageApplicationCommandData;
}

/**
 * Allows to type check a context menu command definition.
 * @public
 * @example
 * ```
 * export default defineContextMenuCommand({
 *    key: "mycommand",
 * 
 *    type: ApplicationCommandType.Message,
 *    allowDMs: false,
 * 
 *    handler: async req => {
 *        // implementation of mycommand goes here
 *    }
 * });
 * ```
 */
export function defineContextMenuCommand<InteractionType extends ContextMenuInteractionType, AllowDMs extends boolean = true>(definition: ContextMenuCommandDefinition<InteractionType, AllowDMs>) {
    return definition;
}
