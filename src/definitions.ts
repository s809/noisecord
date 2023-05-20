/**
 * @file Contains definitions for commands.
 */

import { ApplicationCommandOptionType, ApplicationCommandSubCommandData, ApplicationCommandType, Awaitable, CacheType, Channel, ChannelType, ContextMenuCommandInteraction, GuildTextBasedChannel, LocalizationMap, MessageApplicationCommandData, MessageContextMenuCommandInteraction, PermissionResolvable, Role, Snowflake, User, UserApplicationCommandData, UserContextMenuCommandInteraction } from "discord.js";
import { DistributiveOmit } from "./util.js";
import { CommandCondition } from "./conditions/index.js";
import { CommandRequest } from "./handlers/CommandRequest.js";
import { Translator } from "./Translator.js";
import { IterableElement, Simplify } from "type-fest";
import { InteractionCommandRequest, MessageCommandRequest } from "./index.js";

/** @public */
export const textChannels = [
    ChannelType.GuildAnnouncement,
    ChannelType.PublicThread, ChannelType.PrivateThread, ChannelType.AnnouncementThread,
    ChannelType.GuildText
] as const;

/** @public */
export interface CommandDefinition<OwnerOnly extends boolean = boolean, AllowDMs extends boolean = boolean, Args extends readonly CommandDefinitionArgument[] = readonly CommandDefinitionArgument[]> {
    key: string;

    ownerOnly?: OwnerOnly;
    defaultMemberPermissions?: PermissionResolvable | null;
    allowDMs?: AllowDMs;
    conditions?: CommandCondition | CommandCondition[];

    args?: Args;
    handler?: CommandHandler<OwnerOnly, AllowDMs, {
        [Item in Args[number] as Item["key"]]: CommandHandlerArgument<Item>;
    }>;
}

/** @public */
export interface Command {
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
}

/** @public */
export type CommandDefinitionArgument = Simplify<(DistributiveOmit<IterableElement<NonNullable<ApplicationCommandSubCommandData["options"]>>, "name" | "nameLocalizations" | "description" | "descriptionLocalizations" | "choices"> & {
    key: string;
    choices?: readonly {
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
export type ParsedArguments = Record<string, string | string[] | number | boolean | User | GuildTextBasedChannel | Role | undefined>;

/** @public */
export type CommandHandler<OwnerOnly extends boolean = boolean, AllowDMs extends boolean = boolean, Args extends ParsedArguments = ParsedArguments> = (
    req: OwnerOnly extends true
        ? MessageCommandRequest<AllowDMs extends true ? boolean : true>
        : CommandRequest<AllowDMs extends true ? boolean : true>,
    args: Args
) => Awaitable<string | void>;

/** @public */
export type CommandHandlerArgument<T extends CommandDefinitionArgument> = T["type"] extends keyof ArgumentToTypeMap<T["isExtras"]>
    ? T["choices"] extends readonly any[]
        ? T["choices"][number]["value"]
        : ArgumentToTypeMap<T["isExtras"]>[T["type"]] | (T["required"] extends false ? undefined : never)
    : never;

/** @public */
export interface ArgumentToTypeMap<IsExtras extends boolean | undefined> {
    [ApplicationCommandOptionType.String]: IsExtras extends true ? string[] : string;
    [ApplicationCommandOptionType.Number]: number;
    [ApplicationCommandOptionType.Integer]: number;
    [ApplicationCommandOptionType.Boolean]: boolean;
    [ApplicationCommandOptionType.Channel]: GuildTextBasedChannel;
    [ApplicationCommandOptionType.User]: User;
    [ApplicationCommandOptionType.Role]: Role;
}

/** @public */
export interface InteractionCommandData {
    id: Snowflake | null;
}

/** @public */
export type ContextMenuInteractionType = ContextMenuCommandInteraction["commandType"];

/** @public */
export interface ContextMenuCommandDefinition<InteractionType extends ContextMenuInteractionType = ContextMenuInteractionType, AllowDMs extends boolean = boolean> {
    key: string;
    type: InteractionType;
    allowDMs?: AllowDMs;
    handler: (interaction: InteractionCommandRequest<ContextMenuCommand<ContextMenuTypeToInteraction<AllowDMs extends false ? Exclude<CacheType, undefined> : CacheType>[InteractionType]>, AllowDMs extends true ? boolean : true>, translator: Translator) => void;
}

/** @public */
export interface ContextMenuTypeToInteraction<Cached extends CacheType> {
    [ApplicationCommandType.User]: UserContextMenuCommandInteraction<Cached>;
    [ApplicationCommandType.Message]: MessageContextMenuCommandInteraction<Cached>;
}

/** @public */
export interface ContextMenuCommand<InteractionType extends ContextMenuCommandInteraction = ContextMenuCommandInteraction> {
    key: string;
    type: ContextMenuInteractionType;
    allowDMs: boolean;
    handler: (interaction: InteractionCommandRequest<ContextMenuCommand<InteractionType>>, translator: Translator) => void;
    appCommandId: Snowflake | null;
    appCommandData: UserApplicationCommandData | MessageApplicationCommandData;
}

/**
 * This function is just for convenience/type checking.
 * @public
 */
export function defineCommand<OwnerOnly extends boolean = false, AllowDMs extends boolean = true, Args extends readonly CommandDefinitionArgument[] = readonly CommandDefinitionArgument[]>(definition: CommandDefinition<OwnerOnly, AllowDMs, Args>) {
    return definition;
}

/**
 * This function is just for convenience/type checking.
 * @public
 */
export function defineContextMenuCommand<InteractionType extends ContextMenuInteractionType, AllowDMs extends boolean = true>(definition: ContextMenuCommandDefinition<InteractionType, AllowDMs>) {
    return definition;
}
