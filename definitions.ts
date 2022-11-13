/**
 * @file Contains definitions for commands.
 */

import { ApplicationCommandData, ApplicationCommandSubCommandData, Awaitable, Channel, ChannelType, LocaleString, MessageContextMenuCommandInteraction, Role, Snowflake, User, UserContextMenuCommandInteraction } from "discord.js";
import { ArrayElement, DistributiveOmit, Overwrite } from "./util";
import { CommandCondition } from "./conditions";
import { CommandMessage } from "./CommandMessage";
import { Translator } from "./Translator";

export const textChannels = [
    ChannelType.GuildAnnouncement,
    ChannelType.PublicThread, ChannelType.PrivateThread, ChannelType.AnnouncementThread,
    ChannelType.GuildText
];

export interface CommandDefinition {
    key: string;

    ownerOnly?: boolean;
    defaultMemberPermissions?: ApplicationCommandData["defaultMemberPermissions"];
    allowDMs?: boolean;
    conditions?: CommandCondition | CommandCondition[];
    usableAsAppCommand?: boolean;

    args?: (DistributiveOmit<
        ArrayElement<NonNullable<ApplicationCommandSubCommandData["options"]>>,
        "name" | "nameLocalizations" | "description" | "descriptionLocalizations" |
        "choices"
    > & {
        translationKey: string;
        choices?: {
            translationKey: string;
            value: string | number;
        }[];
        isExtras?: boolean;
    })[];
    handler?: CommandHandler;
    alwaysReactOnSuccess?: boolean;
}

export type Command = Overwrite<{
    [K in keyof CommandDefinition]-?: NonNullable<CommandDefinition[K]>;
}, {
    path: string;
    translationPath: string;

    nameTranslations: Record<LocaleString, string>;
    descriptionTranslations: Record<LocaleString, string>;
    usageTranslations: Record<LocaleString, string>;

    conditions: CommandCondition[]
    appCommandId: Snowflake | null;

    args: {
        min: number;
        max: number;
        stringTranslations: Record<LocaleString, string>;
        list: (ArrayElement<NonNullable<ApplicationCommandSubCommandData["options"]>> & {
            translationKey: string;
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
    appCommandData: ApplicationCommandData;
}
