/**
 * @file Contains definitions for commands.
 */

import { ApplicationCommandOptionType, ApplicationCommandSubCommandData, Awaitable, GuildTextBasedChannel, LocalizationMap, PermissionResolvable, Role, Snowflake, User } from "discord.js";
import { DeeplyNestedObject, DistributiveOmit } from "../util.js";
import { CommandCondition } from "../conditions/index.js";
import { CommandRequest } from "../handlers/CommandRequest.js";
import { IterableElement, Simplify } from "type-fest";
import { MessageCommandRequest } from "../handlers/Message/MessageCommandRequest.js";
import { AllowDMsInGuild } from "./common.js";
import { PreparedTranslation } from "../translations/PreparedTranslation.js";
import { ConditionalSimplifyDeep } from "type-fest/source/conditional-simplify.js";

/**
 * Definition for a command.
 * @public
 */
export interface CommandDefinition<
    OwnerOnly extends boolean = boolean,
    AllowDMs extends boolean = boolean,
    Args extends readonly CommandDefinition.Argument[] = readonly CommandDefinition.Argument[],
    Translations extends DeeplyNestedObject<boolean> = DeeplyNestedObject<boolean>
> {
    key: string;

    ownerOnly?: OwnerOnly;
    defaultMemberPermissions?: PermissionResolvable | null;
    allowDMs?: AllowDMs;
    conditions?: CommandCondition | CommandCondition[];

    translations?: Translations;

    args?: Args;
    handler?: Command.Handler<
        OwnerOnly,
        AllowDMs,
        CommandDefinition.HandlerArguments<Args>,
        Translations
    >;
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
    translations: string[];

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
    export type PreparedTranslations<Input extends DeeplyNestedObject<boolean> = DeeplyNestedObject<boolean>> = {
        [K in keyof Input]: K extends `${string}.${string}`
            ? never
            : Input[K] extends boolean
                ? PreparedTranslation
                : ConditionalSimplifyDeep<
                    PreparedTranslations<Exclude<Input[K], boolean>>,
                    PreparedTranslation>;
    };

    /** @public */
    export type Handler<
        OwnerOnly extends boolean = boolean,
        AllowDMs extends boolean = boolean,
        Args extends HandlerArguments = HandlerArguments,
        Translations extends DeeplyNestedObject<boolean> = DeeplyNestedObject<boolean>
    > = (
        req: OwnerOnly extends true
            ? MessageCommandRequest<AllowDMsInGuild<AllowDMs>>
            : CommandRequest<AllowDMsInGuild<AllowDMs>>,
        args: Args,
        translations: PreparedTranslations<Translations>
    ) => Awaitable<string | PreparedTranslation | void>;

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
export function defineCommand<
    const OwnerOnly extends boolean = false,
    const AllowDMs extends boolean = true,
    const Args extends readonly CommandDefinition.Argument[] = never[],
    const Translations extends DeeplyNestedObject<boolean> = never
>(definition: CommandDefinition<OwnerOnly, AllowDMs, Args, Translations>) {
    return definition;
}

const a = defineCommand({
    key: "mycommand",

    ownerOnly: true,

    args: [{
        key: "num",
        type: ApplicationCommandOptionType.Number,
    }, {
        key: "extras",
        type: ApplicationCommandOptionType.String,
        extras: true,
        }],

    translations: {
        test: true,
        test2: {
            test3: false
        }
    },

    handler: async (req, { num, extras }, translations) => {
        // implementation of mycommand goes here
    },
 });
