import { LocaleString, Snowflake } from "discord.js";
import path from "path";
import {
    createCommand,
    CreateCommandUtil, InheritableOptions
} from "./CreateCommandUtil.js";
import { Command, CommandDefinition, ContextMenuCommand, ContextMenuCommandDefinition } from "./definitions.js";
import { importModules, isTsNode } from "./importHelper.js";
import { Translator } from "./Translator.js";
import { TranslatorManager } from "./TranslatorManager.js";
import { DeeplyNestedMap, traverseTree } from "./util.js";

/** @public */
export interface CommandRegistryOptions {
    commandModuleDirectory?: string;
    contextMenuModuleDirectory?: string;
}

/** @public */
export class CommandRegistry {
    readonly commands: Map<string, Command> = new Map();
    readonly commandsByLocale: Map<LocaleString, DeeplyNestedMap<Command>> = new Map();
    readonly contextMenuCommands: ContextMenuCommand[] = [];
    readonly commandsById: Map<Snowflake, Map<string, Command> | ContextMenuCommand> = new Map();

    /** @internal */
    constructor(private options: CommandRegistryOptions, readonly translatorManager: TranslatorManager) { }

    /** @internal */
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
                    interactionCommand: structuredClone(lastParent.interactionCommand),
                    ownerOnly: lastParent.ownerOnly,
                    defaultMemberPermissions: lastParent.defaultMemberPermissions,
                    allowDMs: lastParent.allowDMs,
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

    /** @internal */
    async createContextMenuCommands() {
        if (!this.options.contextMenuModuleDirectory)
            return this.contextMenuCommands;

        const definitions = await importModules<ContextMenuCommandDefinition>(this.options.contextMenuModuleDirectory);
        
        for (const [, definition] of definitions) {
            const nameLocalizations = this.translatorManager.getLocalizations(`context_menu_commands.${definition.key}.name`);
            if (!nameLocalizations[this.translatorManager.fallbackLocale])
                throw new Error(`Context menu command ${definition.key} has no name in default locale (${this.translatorManager.fallbackLocale}).`);

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
     * Resolves command by its path.
     *
     * @param path - Path to command.
     * @param allowPartialResolve - Whether to allow resolving to closest match.
     * @returns Command, if it was found.
     */
    resolveCommandByPath(path: string | string[], allowPartialResolve: boolean = false): Command | null {
        if (typeof path === "string")
            path = path.split("/");

        return traverseTree(path,
            this.commands,
            command => command.subcommands,
            allowPartialResolve);
    }

    resolveCommandByLocalizedPath(path: string | string[], translator: Translator, allowFallback = true): Command | null {
        if (typeof path === "string")
            path = path.split("/");

        const translatorSubMap = this.commandsByLocale.get(translator.localeString);
        const fallbackSubMap = this.commandsByLocale.get(this.translatorManager!.fallbackLocale)!;
        const subMap = translatorSubMap?.has(path[0]) || !allowFallback
            ? translatorSubMap!
            : fallbackSubMap;

        const result = traverseTree(path,
            subMap,
            v => v instanceof Map ? v : null,
            true);
        return result && !(result instanceof Map) ? result : null;
    }

    getCommandUsageString(command: Command, prefix: string, translator: Translator) {
        let map = this.commands;
        const localizedCommandPath = command.path.split("/").map(a => {
            const c = map.get(a)!;
            map = c.subcommands;
            return translator.getTranslationFromRecord(c.nameTranslations);
        }).join(" ");

        const localizedArgs = translator.getTranslationFromRecord(command.args.stringTranslations) ?? "";
        return `${prefix}${localizedCommandPath} ${localizedArgs}`.trimEnd();
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
     * @param list - List of commands to iterate.
     */
    *iterateSubcommands(list: ReadonlyMap<string, Command>): Iterable<Command> {
        for (const command of list.values()) {
            yield command;
            yield* this.iterateSubcommands(command.subcommands);
        }
    }
}
