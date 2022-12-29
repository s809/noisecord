import assert from 'assert';
import { ChatInputApplicationCommandData, ApplicationCommandType, ApplicationCommandOptionType, ApplicationCommandSubGroupData, ApplicationCommandDataResolvable, Client } from 'discord.js';
import { defaults } from 'lodash-es';
import { CommandRegistry } from './CommandRegistry';
import { TranslatorManager } from './TranslatorManager';

/*
    for testing later
    application: {
        commands: {
            set: sinon.fake(async (commands: ApplicationCommandDataResolvable[]) =>
                commands.map((command, i) => ({ ...command, id: i.toString() })))
        }
    },
*/

export class ApplicationCommandManager {
    private readonly translatorManager: TranslatorManager;

    constructor(private readonly commandRegistry: CommandRegistry) {
        this.translatorManager = commandRegistry.translatorManager;
     }

    async init(client: Client<true>) {
        const chatCommands = this.makeChatCommands();
        const contextMenuCommands = await this.commandRegistry.createContextMenuCommands();

        const result = await client.application.commands.set(
            (chatCommands as ApplicationCommandDataResolvable[])
                .concat(contextMenuCommands.map(({ appCommandData }) => appCommandData))
        );

        const rootCommands = [...this.commandRegistry.commands.values()];
        for (const appCommand of result.values()) {
            switch (appCommand.type) {
                case ApplicationCommandType.ChatInput: {
                    const command = rootCommands.find(x => x.nameTranslations[this.translatorManager.fallbackLocale] === appCommand.name);
                    assert(command, `Failed to find source command for ${appCommand.name}`);
                    command.appCommandId = appCommand.id;

                    for (const childCommand of this.commandRegistry.iterateSubcommands(command.subcommands)) {
                        if (childCommand.usableAsAppCommand)
                            childCommand.appCommandId = appCommand.id;
                    }
                    break;
                }
                case ApplicationCommandType.Message:
                case ApplicationCommandType.User: {
                    const command = contextMenuCommands.find(command => appCommand.name === command.appCommandData.name);
                    if (command)
                        command.appCommandId = appCommand.id;
                    break;
                }
            }
        }

        return this;
    }

    private makeChatCommands() {
        const commands: ChatInputApplicationCommandData[] = [];

        for (const command of this.commandRegistry.iterateCommands()) {
            if (!command.usableAsAppCommand)
                continue;

            try {
                if (command.handler && command.subcommands.size)
                    throw new Error("Commands with subcommands cannot be run on their own.");

                const data: ChatInputApplicationCommandData & {
                    options: typeof command.args.list;
                } = {
                    name: command.nameTranslations[this.translatorManager.fallbackLocale]!,
                    description: command.descriptionTranslations[this.translatorManager.fallbackLocale]!,
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

        return commands;
    }
}
