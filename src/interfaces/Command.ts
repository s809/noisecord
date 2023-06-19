/**
 * @file Contains definitions for commands.
 */

import { ApplicationCommandOptionType, ApplicationCommandSubCommandData, Awaitable, GuildTextBasedChannel, LocalizationMap, PermissionResolvable, Role, Snowflake, User } from "discord.js";
import { DistributiveOmit } from "../util.js";
import { CommandCondition } from "../conditions/index.js";
import { CommandRequest } from "../handlers/CommandRequest.js";
import { IterableElement, RequireExactlyOne, Simplify } from "type-fest";
import { MessageCommandRequest } from "../handlers/Message/MessageCommandRequest.js";
import { AllowDMsInGuild } from "./common.js";

/** 
 * Definition for a command.
 * @public
 */
export interface CommandDefinition<OwnerOnly extends boolean = boolean, AllowDMs extends boolean = boolean, Args extends readonly CommandDefinition.Argument[] = readonly CommandDefinition.Argument[]> {
    key: string;

    ownerOnly?: OwnerOnly;
    defaultMemberPermissions?: PermissionResolvable | null;
    allowDMs?: AllowDMs;
    conditions?: CommandCondition | CommandCondition[];

    args?: Args;
    handler?: Command.Handler<OwnerOnly, AllowDMs, CommandDefinition.HandlerArguments<Args>>;
}

/** @public */
export namespace CommandDefinition {
    /** @public */
    export type Argument = Simplify<(DistributiveOmit<IterableElement<NonNullable<ApplicationCommandSubCommandData["options"]>>, "name" | "nameLocalizations" | "description" | "descriptionLocalizations" | "choices"> & {
        key: string;
        choices?: readonly {
            key: string;
            value: string | number;
        }[];
        extras?: boolean;
        raw?: boolean;
    })>;

    /** @public */
    export type HandlerArguments<Args extends readonly Argument[]> = {
        [Item in Args[number] as Item["key"]]: Item["type"] extends keyof ArgumentToTypeMap<Item["extras"]>
            ? Item["choices"] extends readonly any[]
                ? Item["choices"][number]["value"]
                : ArgumentToTypeMap<Item["extras"]>[Item["type"]] | (Item["required"] extends false ? undefined : never)
            : never;
    };

    /** @public */
    export interface ArgumentToTypeMap<Extras extends boolean | undefined> {
        [ApplicationCommandOptionType.String]: Extras extends true ? string[] : string;
        [ApplicationCommandOptionType.Number]: number;
        [ApplicationCommandOptionType.Integer]: number;
        [ApplicationCommandOptionType.Boolean]: boolean;
        [ApplicationCommandOptionType.Channel]: GuildTextBasedChannel;
        [ApplicationCommandOptionType.User]: User;
        [ApplicationCommandOptionType.Role]: Role;
    }
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

    interactionCommand: Command.InteractionCommandData | null;

    args: Command.ArgumentData;
    handler: Command.Handler | null;

    subcommands: Map<string, Command>;
}

/** @public */
export namespace Command {
    /** @public */
    export interface ArgumentData {
        min: number;
        max: number;
        stringTranslations: LocalizationMap;
        list: Simplify<(IterableElement<NonNullable<ApplicationCommandSubCommandData["options"]>> & {
            key: string;
        })>[];
        lastArgumentType: "extras" | "raw" | null;
    };
    
    /** @public */
    export type HandlerArguments = Record<string, string | string[] | number | boolean | User | GuildTextBasedChannel | Role | undefined>;

    /** @public */
    export type Handler<OwnerOnly extends boolean = boolean, AllowDMs extends boolean = boolean, Args extends HandlerArguments = HandlerArguments> = (
        req: OwnerOnly extends true
            ? MessageCommandRequest<AllowDMsInGuild<AllowDMs>>
            : CommandRequest<AllowDMsInGuild<AllowDMs>>,
        args: Args
    ) => Awaitable<string | void>;

    /** @public */
    export interface InteractionCommandData {
        id: Snowflake | null;
    }
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
 *        extras: true,
 *    }],
 * 
 *    handler: async (req, { num, extras }) => {
 *        // implementation of mycommand goes here
 *    },
 * });
 * ```
 */
export function defineCommand<OwnerOnly extends boolean = false, AllowDMs extends boolean = true, Args extends readonly CommandDefinition.Argument[] = readonly CommandDefinition.Argument[]>(definition: CommandDefinition<OwnerOnly, AllowDMs, Args>) {
    return definition;
}
