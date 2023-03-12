/**
 * @file Contains definitions for commands.
 */

import { ApplicationCommandSubCommandData, Awaitable, Channel, ChannelType, LocalizationMap, MessageApplicationCommandData, MessageContextMenuCommandInteraction, PermissionResolvable, Role, Snowflake, User, UserApplicationCommandData, UserContextMenuCommandInteraction } from "discord.js";
import { DistributiveOmit } from "./util.js";
import { CommandCondition } from "./conditions/index.js";
import { CommandRequest } from "./messageTypes/CommandRequest.js";
import { Translator } from "./Translator.js";
import { IterableElement, Merge } from "type-fest";
import { SimpleMerge } from "type-fest/source/merge.js";

/** @public */
export const textChannels = [
    ChannelType.GuildAnnouncement,
    ChannelType.PublicThread, ChannelType.PrivateThread, ChannelType.AnnouncementThread,
    ChannelType.GuildText
] as const;

/** @public */
export interface CommandDefinition {
    key: string;

    ownerOnly?: boolean;
    defaultMemberPermissions?: PermissionResolvable | null;
    allowDMs?: boolean;
    conditions?: CommandCondition | CommandCondition[];
    
    interactionCommand?: boolean;

    args?: (DistributiveOmit<
        IterableElement<NonNullable<ApplicationCommandSubCommandData["options"]>>,
        "name" | "nameLocalizations" | "description" | "descriptionLocalizations" |
        "choices"
    > & {
        key: string;
        choices?: {
            key: string;
            value: string | number;
        }[];
        isExtras?: boolean;
    })[];
    handler?: CommandHandler;
    alwaysReactOnSuccess?: boolean;
}

/** @public */
export type Command = SimpleMerge<Required<CommandDefinition>, {
    path: string;
    key: string;
    translationPath: string;

    nameTranslations: LocalizationMap;
    descriptionTranslations: LocalizationMap;
    usageTranslations: LocalizationMap;

    ownerOnly: boolean;
    defaultMemberPermissions: PermissionResolvable;
    allowDMs: boolean;
    conditions: CommandCondition[];

    interactionCommand: {
        id: Snowflake | null
    } | null;

    args: {
        min: number;
        max: number;
        stringTranslations: LocalizationMap;
        list: (IterableElement<NonNullable<ApplicationCommandSubCommandData["options"]>> & {
            key: string;
        })[],
        lastArgAsExtras: boolean;
    };
    handler: CommandHandler | null;

    subcommands: Map<string, Command>;
}>

/** @public */
export type ParsedArguments = Record<string, string | string[] | number | boolean | User | Channel | Role>;

/** @public */
export type CommandHandler = (
    req: CommandRequest,
    args: ParsedArguments
) => Awaitable<string | void>;

type ContextMenuCommandInteractions = UserContextMenuCommandInteraction | MessageContextMenuCommandInteraction;

/** @public */
export interface ContextMenuCommandDefinition<T extends ContextMenuCommandInteractions = ContextMenuCommandInteractions> {
    key: string;
    type: T["commandType"];
    handler: (interaction: T, translator: Translator) => void;
}

/** @public */
export interface ContextMenuCommand<T extends ContextMenuCommandInteractions = ContextMenuCommandInteractions> extends ContextMenuCommandDefinition<T> {
    appCommandId: Snowflake | null;
    appCommandData: UserApplicationCommandData | MessageApplicationCommandData;
}

/**
 * This function is just for convenience/type checking.
 * @public
 */
export function defineCommand<T extends CommandDefinition | ContextMenuCommandDefinition = CommandDefinition>(definition: T) {
    return definition;
}
