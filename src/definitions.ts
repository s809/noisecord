/**
 * @file Contains definitions for commands.
 */

import { ApplicationCommandOptionType, ApplicationCommandSubCommandData, Awaitable, Channel, ChannelType, ContextMenuCommandInteraction, LocalizationMap, MessageApplicationCommandData, MessageContextMenuCommandInteraction, PermissionResolvable, Role, Snowflake, User, UserApplicationCommandData, UserContextMenuCommandInteraction } from "discord.js";
import { DistributiveOmit } from "./util.js";
import { CommandCondition } from "./conditions/index.js";
import { CommandRequest } from "./messageTypes/CommandRequest.js";
import { Translator } from "./Translator.js";
import { IterableElement, Simplify } from "type-fest";
import { SimpleMerge } from "type-fest/source/merge.js";

/** @public */
export const textChannels = [
    ChannelType.GuildAnnouncement,
    ChannelType.PublicThread, ChannelType.PrivateThread, ChannelType.AnnouncementThread,
    ChannelType.GuildText
] as const;

/** @public */
export interface CommandDefinition<Args extends readonly CommandDefinitionArgument[] = readonly CommandDefinitionArgument[]> {
    key: string;

    ownerOnly?: boolean;
    defaultMemberPermissions?: PermissionResolvable | null;
    allowDMs?: boolean;
    conditions?: CommandCondition | CommandCondition[];

    args?: Args;
    handler?: CommandHandler<{
        [Item in Args[number] as Item["key"]]: CommandHandlerArgument<Item>;
    }>;
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

    interactionCommand: InteractionCommandData | null;

    args: CommandArguments;
    handler: CommandHandler | null;

    subcommands: Map<string, Command>;
}>

/** @public */
export type CommandDefinitionArgument = Simplify<(DistributiveOmit<IterableElement<NonNullable<ApplicationCommandSubCommandData["options"]>>, "name" | "nameLocalizations" | "description" | "descriptionLocalizations" | "choices"> & {
    key: string;
    choices?: {
        key: string;
        value: string | number;
    }[];
    isExtras?: boolean;
})>;

/** @public */
export interface CommandArguments {
    min: number;
    max: number;
    stringTranslations: LocalizationMap;
    list: Simplify<(IterableElement<NonNullable<ApplicationCommandSubCommandData["options"]>> & {
        key: string;
    })>[];
    lastArgAsExtras: boolean;
};

/** @public */
export type ParsedArguments = Record<string, string | string[] | number | boolean | User | Channel | Role | undefined>;

/** @public */
export type CommandHandler<Args extends ParsedArguments = ParsedArguments> = (
    req: CommandRequest,
    args: Args
) => Awaitable<string | void>;

/** @public */
export type CommandHandlerArgument<T extends CommandDefinitionArgument> = T["type"] extends keyof ArgumentToTypeMap<T["isExtras"]>
    ? ArgumentToTypeMap<T["isExtras"]>[T["type"]] | (T["required"] extends false ? undefined : never)
    : never;

/** @public */
export interface ArgumentToTypeMap<IsExtras extends boolean | undefined> {
    [ApplicationCommandOptionType.String]: IsExtras extends true ? string[] : string;
    [ApplicationCommandOptionType.Number]: number;
    [ApplicationCommandOptionType.Integer]: number;
    [ApplicationCommandOptionType.Boolean]: boolean;
    [ApplicationCommandOptionType.Channel]: Channel;
    [ApplicationCommandOptionType.User]: User;
    [ApplicationCommandOptionType.Role]: Role;
}

/** @public */
export interface InteractionCommandData {
    id: Snowflake | null;
}

/** @public */
export interface ContextMenuCommandDefinition<T extends ContextMenuCommandInteraction = ContextMenuCommandInteraction> {
    key: string;
    type: T["commandType"];
    handler: (interaction: T, translator: Translator) => void;
}

/** @public */
export interface ContextMenuCommand<T extends ContextMenuCommandInteraction = ContextMenuCommandInteraction> extends ContextMenuCommandDefinition<T> {
    appCommandId: Snowflake | null;
    appCommandData: UserApplicationCommandData | MessageApplicationCommandData;
}

/**
 * This function is just for convenience/type checking.
 * @public
 */
export function defineCommand<T extends readonly CommandDefinitionArgument[]>(definition: CommandDefinition<T>) {
    return definition;
}

/**
 * This function is just for convenience/type checking.
 * @public
 */
export function defineContextMenuCommand(definition: ContextMenuCommandDefinition) {
    return definition;
}
