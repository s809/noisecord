import { LocaleString, Snowflake } from "discord.js";
import path from "path";
import {
    createCommand, fillArguments, fillInheritableOptions,
    fillTranslations, InheritableOptions
} from "./createCommandUtil";
import { Command, CommandDefinition, ContextMenuCommand, ContextMenuCommandDefinition } from "./definitions";
import { importModules, isTsNode } from "./importHelper";
import { TranslatorManager } from "./TranslatorManager";
import { DeeplyNestedMap } from "./util";

export interface CommandRegistryOptions {
    commandModuleDirectory?: string;
    contextMenuModuleDirectory?: string;
}

export class CommandRegistry {
    readonly commands: Map<string, Command> = new Map();
    readonly commandsByLocale: Map<LocaleString, DeeplyNestedMap<Command>> = new Map();
    readonly contextMenuCommands: ContextMenuCommand[] = [];
    readonly commandsById: Map<Snowflake, Map<string, Command> | ContextMenuCommand> = new Map();

    constructor(private options: CommandRegistryOptions, readonly translatorManager: TranslatorManager) { }

    async createCommands() {
        if (!this.options.commandModuleDirectory) return this;

        const queue = await importModules<CommandDefinition>(path.resolve(this.options.commandModuleDirectory, "*"));
        
        // Add modules from directory recursively
        for (let i = 0; i < queue.length; i++) {
            const modulePath = queue[i][0];
            if (!modulePath.endsWith(isTsNode ? ".ts" : ".js"))
                queue.push(...await importModules<CommandDefinition>(path.resolve(modulePath, "*")));
        }

        // Create and add commands to tree
        for (const [filePath, definition] of queue) {
            const partialCommand = createCommand(definition);
            const commandPath = path.relative(this.options.commandModuleDirectory, filePath).split(".")[0];

            const commandChain: Command[] = [];
            const parentSubcommands = commandPath.split("/").slice(0, -1).reduce(
                (map, key) => {
                    const command = map.get(key)!;
                    commandChain.push(command);

                    return command.subcommands;
                },
                this.commands
            );

            const lastParent = commandChain[commandChain.length - 1];
            const inheritedOptions = lastParent
                ? {
                    path: lastParent.path,
                    conditions: [...lastParent.conditions],
                    usableAsAppCommand: lastParent.usableAsAppCommand,
                    ownerOnly: lastParent.ownerOnly,
                    defaultMemberPermissions: lastParent.defaultMemberPermissions,
                    allowDMs: lastParent.allowDMs
                } as InheritableOptions
                : undefined;
            
            fillInheritableOptions(partialCommand, inheritedOptions);
            fillTranslations(partialCommand, this.translatorManager);
            fillArguments(partialCommand, definition.args, this.translatorManager);

            const command = partialCommand as Command;
            parentSubcommands.set(partialCommand.key!, command);

            // Add to commandsByLocale tree
            for (const [locale, translation] of Object.entries(command.nameTranslations)) {
                let localeCommands = this.commandsByLocale.get(locale as LocaleString);
                if (!localeCommands) {
                    localeCommands = new Map();
                    this.commandsByLocale.set(locale as LocaleString, localeCommands);
                }

                commandChain.map(command => command.nameTranslations[locale as LocaleString])
                    .reduce(
                        (map, key) => {
                            let subMap = map.get(key) as typeof map;
                            if (!subMap) {
                                subMap = new Map();
                                map.set(key, subMap);
                            }
                            return subMap;
                        },
                        localeCommands
                    )
                    .set(translation, command);
            }
        }

        return this;
    }

    async createContextMenuCommands() {
        if (!this.options.contextMenuModuleDirectory)
            return this.contextMenuCommands;

        const definitions = await importModules<ContextMenuCommandDefinition>(path.resolve(this.options.contextMenuModuleDirectory, "*"));
        
        for (const [, definition] of definitions) {
            const nameLocalizations = this.translatorManager.getLocalizations(`contextMenuCommands.${definition.key}.name`);
            if (!nameLocalizations[this.translatorManager.fallbackLocale])
                throw new Error(`Context menu command ${definition.key} has no name in default locale.`);

            this.contextMenuCommands.push({
                ...definition,
                appCommandId: null,
                appCommandData: {
                    type: definition.type,
                    name: nameLocalizations[this.translatorManager.fallbackLocale]!,
                    nameLocalizations,
                    dmPermission: false // Not supported yet
                }
            });
        }
        
        return this.contextMenuCommands;
    }

    /**
     * Recursively iterates commands.
     */
    iterateCommands() {
        return this.iterateSubcommands(this.commands);
    }

    /**
     * Recursively iterates a map with commands.
     *
     * @param list List of commands to iterate.
     */
    *iterateSubcommands(list: ReadonlyMap<string, Command>): Iterable<Command> {
        for (const command of list.values()) {
            yield command;

            if (command.subcommands)
                yield* this.iterateSubcommands(command.subcommands);
        }
    }
}
