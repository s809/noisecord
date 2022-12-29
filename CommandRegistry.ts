import { LocaleString, Snowflake } from "discord.js";
import path from "path";
import {
    createCommand,
    CreateCommandUtil, InheritableOptions
} from "./CreateCommandUtil";
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

        const queue = await importModules<CommandDefinition>(this.options.commandModuleDirectory);
        
        // Add modules from directory recursively
        for (let i = 0; i < queue.length; i++) {
            const modulePath = queue[i][0];
            if (!modulePath.endsWith(isTsNode ? ".ts" : ".js"))
                queue.push(...await importModules<CommandDefinition>(modulePath));
        }

        const getParentChain = (path: string) => {
            const chain: Command[] = [];
            path.split("/").slice(0, -1).reduce(
                (map, key) => {
                    const command = map.get(key)!;
                    chain.push(command);

                    return command.subcommands;
                },
                this.commands
            );
            return chain;
        }
        const createCommandUtil = new CreateCommandUtil(this.translatorManager);

        // Create and add commands to tree
        for (const [filePath, definition] of queue) {
            const partialCommand = createCommand(definition);
            const commandPath = path.relative(this.options.commandModuleDirectory, filePath).split(".")[0];

            const parentChain = getParentChain(commandPath);
            const lastParent = parentChain[parentChain.length - 1];
            
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

            if (inheritedOptions)
                partialCommand.path = `${inheritedOptions.path}/${partialCommand.key}`;
            else
                partialCommand.path = partialCommand.key;
            createCommandUtil.setHeader(0, partialCommand.path!)

            createCommandUtil.setHeader(1, "Command config");
            createCommandUtil.fillInheritableOptions(partialCommand, inheritedOptions);

            createCommandUtil.setHeader(1, "Command translations");
            createCommandUtil.fillTranslations(partialCommand);

            createCommandUtil.setHeader(1, "Command arguments");
            createCommandUtil.fillArguments(partialCommand, definition.args);

            const command = partialCommand as Command;
            (lastParent?.subcommands ?? this.commands).set(command.key, command);
        }

        createCommandUtil.throwIfErrors();

        // Fill commandsByLocale
        for (const command of this.iterateCommands()) {
            const parentChain = getParentChain(command.path);

            for (const [locale, translation] of Object.entries(command.nameTranslations)) {
                let localeCommands = this.commandsByLocale.get(locale as LocaleString);
                if (!localeCommands) {
                    localeCommands = new Map();
                    this.commandsByLocale.set(locale as LocaleString, localeCommands);
                }

                // *reminder that commandsByLocale is a separate tree
                // since it isn't really used anywhere besides resolving commands
                parentChain.map(command => command.nameTranslations[locale as LocaleString]!)
                    .reduce(
                        // TODO Unsafely assumes that entire chain has localization for current locale
                        (map, key) => map.get(key)! as DeeplyNestedMap<Command>,
                        localeCommands
                    )
                    .set(translation!, command.subcommands.size
                        ? new Map()
                        : command);
            }
        }

        return this;
    }

    async createContextMenuCommands() {
        if (!this.options.contextMenuModuleDirectory)
            return this.contextMenuCommands;

        const definitions = await importModules<ContextMenuCommandDefinition>(this.options.contextMenuModuleDirectory);
        
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
                    dmPermission: false // TODO Not supported yet
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
