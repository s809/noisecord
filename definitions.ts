/**
 * @file Contains definitions for commands.
 */

import { ApplicationCommandSubCommandData, Awaitable, Channel, ChannelType, LocaleString, LocalizationMap, MessageApplicationCommandData, MessageContextMenuCommandInteraction, PermissionResolvable, Role, Snowflake, User, UserApplicationCommandData, UserContextMenuCommandInteraction } from "discord.js";
import { ArrayElement, DistributiveOmit, Overwrite } from "./util";
import { CommandCondition } from "./conditions";
import { CommandMessage } from "./messageTypes/CommandMessage";
import { Translator } from "./Translator";

export const textChannels = [
    ChannelType.GuildAnnouncement,
    ChannelType.PublicThread, ChannelType.PrivateThread, ChannelType.AnnouncementThread,
    ChannelType.GuildText
] as const;

export interface CommandDefinition {
    key: string;

    ownerOnly?: boolean;
    defaultMemberPermissions?: PermissionResolvable | null;
    allowDMs?: boolean;
    conditions?: CommandCondition | CommandCondition[];
    usableAsAppCommand?: boolean;

    args?: (DistributiveOmit<
        ArrayElement<NonNullable<ApplicationCommandSubCommandData["options"]>>,
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

export type Command = Overwrite<Required<CommandDefinition>, {
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

    usableAsAppCommand: boolean;
    appCommandId: Snowflake | null;

    args: {
        min: number;
        max: number;
        stringTranslations: LocalizationMap;
        list: (ArrayElement<NonNullable<ApplicationCommandSubCommandData["options"]>> & {
            key: string;
        })[],
        lastArgAsExtras: boolean;
    };
    handler: CommandHandler | null;

    subcommands: Map<string, Command>;
}>

export type CommandHandler = (
    msg: CommandMessage,
    args: Record<string, string | string[] | number | boolean | User | Channel | Role>
) => Awaitable<string | void>;

type ContextMenuCommandInteractions = UserContextMenuCommandInteraction | MessageContextMenuCommandInteraction;
export interface ContextMenuCommandDefinition<T extends ContextMenuCommandInteractions = ContextMenuCommandInteractions> {
    key: string;
    type: T["commandType"];
    handler: (interaction: T, translator: Translator) => void;
}

export interface ContextMenuCommand<T extends ContextMenuCommandInteractions = ContextMenuCommandInteractions> extends ContextMenuCommandDefinition<T> {
    appCommandId: Snowflake | null;
    appCommandData: UserApplicationCommandData | MessageApplicationCommandData;
}

/**
 * This function is just for convenience/type checking.
 */
export function defineCommand(definition: CommandDefinition) {
    return definition;
}
