import assert from 'assert';
import { ChatInputApplicationCommandData, ApplicationCommandType, ApplicationCommandOptionType, ApplicationCommandSubGroupData, ApplicationCommandDataResolvable } from 'discord.js';
import { CommandFramework } from './index.mjs';
import { client } from '../../env';
import { defaults } from "../../constants";
import { getContextMenuCommands, setContextMenuCommands } from './contextMenuCommands';
import { Command } from './definitions';

export async function refreshCommands(commandFramework: CommandFramework) {
    const commands: ChatInputApplicationCommandData[] = [];

    // Chat commands
    for (const command of commandFramework.iterateCommands()) {
        if (!command.usableAsAppCommand)
            continue;

        try {
            if (command.handler && command.subcommands.size)
                throw new Error("Commands with subcommands cannot be run on their own.");

            const data: ChatInputApplicationCommandData & {
                options: typeof command.args.list;
            } = {
                name: command.nameTranslations[defaults.locale],
                description: command.descriptionTranslations[defaults.locale],
                nameLocalizations: command.nameTranslations,
                descriptionLocalizations: command.descriptionTranslations,
                options: command.args.list,
                dmPermission: command.allowDMs,
                defaultMemberPermissions: command.defaultMemberPermissions
            };

            const pathParts = command.path.split('/');
            switch (pathParts.length) {
                case 1:
                    commands.push({
                        ...data,
                        type: ApplicationCommandType.ChatInput,
                    });
                    break;
                case 2:
                    const c = commands.find(c => c.name === pathParts[0])!;
                    c.options ??= [];
                    c.options.push({
                        ...data,
                        type: ApplicationCommandOptionType.Subcommand,
                    });
                    break;
                case 3:
                    const cc = commands.find(c => c.name === pathParts[0])!;
                    const s = cc.options!.find(s => s.name === pathParts[1])! as ApplicationCommandSubGroupData;
                    s.type = ApplicationCommandOptionType.SubcommandGroup;
                    s.options ??= [];
                    s.options.push({
                        ...data,
                        type: ApplicationCommandOptionType.Subcommand,
                    });
                    break;
                default:
                    throw new Error("Command depth was exceeded.");
            }
        } catch (e) {
            e.message += `\nPath: ${command.path}`;
            throw e;
        }
    }

    // Context menu commands
    const contextMenuCommands = await getContextMenuCommands();

    const result = await client.application?.commands.set(
        (commands as ApplicationCommandDataResolvable[])
            .concat(contextMenuCommands.map(({ appCommandData }) => appCommandData))
    );
    if (!result) return;

    const rootCommands = [...commandFramework.commands.values()];
    for (const appCommand of result.values()) {
        switch (appCommand.type) {
            case ApplicationCommandType.ChatInput:
                const rootCommand = rootCommands.find(x => x.nameTranslations[defaults.locale] === appCommand.name);
                assert(rootCommand, `Failed to find source command for ${appCommand.name}`);
                // Ignore read-only to add app command ID
                (rootCommand as Command).appCommandId = appCommand.id;

                for (const command of commandFramework.iterateSubcommands(rootCommand.subcommands)) {
                    if (command.usableAsAppCommand)
                        command.appCommandId = appCommand.id;
                }
                break;
            case ApplicationCommandType.Message:
            case ApplicationCommandType.User:
                const command = contextMenuCommands.find(command => appCommand.name === command.appCommandData.name);
                if (command)
                    command.appCommandId = appCommand.id;
                break;
            default:
                break;
        }
    }

    setContextMenuCommands(contextMenuCommands);
}
