import { importModules } from "./importHelper";
import { Command, CommandDefinition } from "./definitions";
import path from "path";
import { TranslatorManager } from "./TranslatorManager";
import {
    createCommand,
    fillInheritableOptions,
    fillTranslations,
    fillArguments,
    InheritableOptions,
} from "./createCommandUtil";
import { LocaleString } from "discord.js";

export interface CommandRegistryOptions {
    commandModuleDirectory: string;
    contextMenuModuleDirectory?: string;
}

type DeeplyNestedMap<V> = Map<string, V | DeeplyNestedMap<V>>;

export class CommandRegistry {
    readonly commands: Map<string, Command> = new Map();
    readonly commandsByLocale: Map<LocaleString, DeeplyNestedMap<Command>> = new Map();

    constructor(private options: CommandRegistryOptions, private translatorManager: TranslatorManager) { }

    async initCommands() {
        const queue = await importModules<CommandDefinition>(path.join(this.options.commandModuleDirectory, "*"));
        
        // Add modules from directory recursively
        for (let i = 0; i < queue.length; i++) {
            const modulePath = queue[i][0];
            if (!modulePath.endsWith(".js"))
                queue.push(...(await importModules<CommandDefinition>(path.join(modulePath, "*"))));
        }

        // Create and add commands to tree
        for (const [filePath, definition] of queue) {
            const partialCommand = createCommand(definition);
            const commandPath = path.relative(this.options.commandModuleDirectory, filePath);

            let inheritedOptions: InheritableOptions | undefined;
            
            const dest = commandPath.split("/").slice(0, -1).reduce(
                (map, key) => {
                    const command = map.get(key)!;

                    inheritedOptions = {
                        path: command.path,
                        conditions: [...command.conditions],
                        usableAsAppCommand: command.usableAsAppCommand,
                        ownerOnly: command.ownerOnly,
                        defaultMemberPermissions: command.defaultMemberPermissions,
                        allowDMs: command.allowDMs
                    };

                    return command.subcommands;
                },
                this.commands
            );
            
            fillInheritableOptions(partialCommand, inheritedOptions);
            fillTranslations(partialCommand, this.translatorManager);
            fillArguments(partialCommand, definition.args, this.translatorManager);

            dest.set(partialCommand.key!, partialCommand as Command);

            for (const [locale, translations] of Object.entries(partialCommand.nameTranslations)) {
                this.commandsByLocale[locale]
            }
        }

        return this;
    }
}
