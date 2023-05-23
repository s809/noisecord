/**
 * @file Contains definitions for commands.
 */

import { ApplicationCommandOptionType, ApplicationCommandSubCommandData, Awaitable, ChannelType, GuildTextBasedChannel, LocalizationMap, PermissionResolvable, Role, Snowflake, User } from "discord.js";
import { DistributiveOmit } from "../util.js";
import { CommandCondition } from "../conditions/index.js";
import { CommandRequest } from "../handlers/CommandRequest.js";
import { IterableElement, Simplify } from "type-fest";
import { MessageCommandRequest } from "../index.js";
import { AllowDMsInGuild } from "./common.js";

/** 
 * Definition for a command.
 * @public
 */
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
        ? MessageCommandRequest<AllowDMsInGuild<AllowDMs>>
        : CommandRequest<AllowDMsInGuild<AllowDMs>>,
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

/**
 * Allows to type check a command definition.
 * @public
 * @example
 * ```
 * export default defineCommand({
 *    key: "mycommand",
 * 
 *    ownerOnly: true,
 *    defaultMemberPermissions: PermissionFlagsBits.Administrator,
 *    conditions: InVoiceChannel,
 * 
 *    args: [{
 *        key: "num",
 *        type: ApplicationCommandOptionType.Number,
 *    }, {
 *        key: "extras",
 *        type: ApplicationCommandOptionType.String,
 *        isExtras: true,
 *    }],
 * 
 *    handler: async (req, { num, extras }) => {
 *        // implementation of mycommand goes here
 *    },
 * });
 * ```
 */
export function defineCommand<OwnerOnly extends boolean = false, AllowDMs extends boolean = true, Args extends readonly CommandDefinitionArgument[] = readonly CommandDefinitionArgument[]>(definition: CommandDefinition<OwnerOnly, AllowDMs, Args>) {
    return definition;
}
