import { LocaleString, Snowflake } from "discord.js";
import path from "path";
import {  CommandCreationHelper } from "./helpers/CommandCreationHelper.js";
import { Command, CommandDefinition } from "./interfaces/Command.js";
import { importModules, isTsNode } from "./helpers/importHelper.js";
import { Translator } from "./translations/Translator.js";
import { TranslatorManager } from "./translations/TranslatorManager.js";
import { DeeplyNestedMap, _traverseTree } from "./util.js";
import { ContextMenuCommand, ContextMenuCommandDefinition } from "./interfaces/ContextMenuCommand.js";
import { TranslationChecker } from "./index.js";

/**
 * Options used to initialize {@link CommandRegistry}
 * @public
 */
export interface CommandRegistryOptions {
    commandModuleDirectory?: string;
    contextMenuModuleDirectory?: string;
    requireCommandTranslations?: boolean;
}

/**
 * Contains the data/functions for working with commands.
 * @public
 */
export class CommandRegistry {
    readonly commands: Map<string, Command> = new Map();
    readonly commandsByLocale: Map<LocaleString, DeeplyNestedMap<Command>> = new Map();
    readonly contextMenuCommands: ContextMenuCommand[] = [];
    readonly commandsById: Map<Snowflake, Map<string, Command> | ContextMenuCommand> = new Map();

    /** @internal */
    constructor(private options: CommandRegistryOptions, readonly translatorManager: TranslatorManager) { }

    /** @internal */
    async createCommands(translationChecker: TranslationChecker) {
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
        const commandCreationHelper = new CommandCreationHelper(this.translatorManager, this.options.requireCommandTranslations ?? false);

        // Create and add commands to tree
        for (const [filePath, definition] of queue) {
            const partialCommand = commandCreationHelper.createCommand(definition);
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
                } as CommandCreationHelper.InheritableOptions
                : undefined;

            if (inheritedOptions)
                partialCommand.path = `${inheritedOptions.path}/${partialCommand.key}`;
            else
                partialCommand.path = partialCommand.key;
            commandCreationHelper.setHeader(0, partialCommand.path!)

            commandCreationHelper.setHeader(1, "Command config");
            commandCreationHelper.fillInheritableOptions(partialCommand, inheritedOptions);

            commandCreationHelper.setHeader(1, "Command translations");
            commandCreationHelper.fillTranslations(partialCommand, this.getCommandTranslationPath(partialCommand.path!));
            if (definition.translations)
                translationChecker.checkTranslations(definition.translations, partialCommand.translationPath);

            commandCreationHelper.setHeader(1, "Command arguments");
            commandCreationHelper.fillArguments(partialCommand, definition.args);

            const command = partialCommand as Command;
            (lastParent?.subcommands ?? this.commands).set(command.key, command);
        }

        for (const command of this.iterateCommands()) {
            commandCreationHelper.setHeader(0, command.path);
            commandCreationHelper.checkTreeValidity(command);

            // Fill commandsByLocale
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

        await this.createContextMenuCommands(commandCreationHelper);

        commandCreationHelper.throwIfErrors();
        return this;
    }

    private async createContextMenuCommands(commandCreationHelper: CommandCreationHelper) {
        if (!this.options.contextMenuModuleDirectory)
            return;

        const definitions = await importModules<ContextMenuCommandDefinition>(this.options.contextMenuModuleDirectory);

        for (const [, definition] of definitions) {
            commandCreationHelper.setHeader(0, `Context menu: ${definition.key}`);

            const nameLocalizations = this.translatorManager.getLocalizations(`${this.getCommandTranslationPath(definition.key, true)}.name`);
            if (!nameLocalizations[this.translatorManager.fallbackLocale] && this.options.requireCommandTranslations)
                commandCreationHelper.addError(`Context menu command ${definition.key} has no name in default locale (${this.translatorManager.fallbackLocale}).`);

            this.contextMenuCommands.push({
                ...definition,
                allowDMs: definition.allowDMs ?? true,
                appCommandId: null,
                appCommandData: {
                    type: definition.type,
                    name: nameLocalizations[this.translatorManager.fallbackLocale] ?? definition.key,
                    nameLocalizations,
                    dmPermission: definition.allowDMs ?? true
                }
            });
        }
    }

    getCommandTranslationPath(path: string): string;
    getCommandTranslationPath(key: string, contextMenu: true): string;
    getCommandTranslationPath(pathOrKey: string, contextMenu?: boolean): string {
        return contextMenu
            ? `context_menu_commands.${pathOrKey}`
            : `commands.${pathOrKey.replaceAll("/", "_")}`;
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

        return _traverseTree(path,
            this.commands,
            command => command.subcommands,
            allowPartialResolve);
    }

    /**
     * Resolves command by its localized path.
     *
     * @param path - Path to command.
     * @param translator - Translator to use for searching.
     * @param allowFallback - Whether to allow fallback to default locale if the given path is inconsistent/in default locale.
     * @returns Command, if it was found.
     */
    resolveCommandByLocalizedPath(path: string | string[], translator: Translator, allowFallback = true): Command | null {
        if (typeof path === "string")
            path = path.split("/");

        const translatorSubMap = this.commandsByLocale.get(translator.localeString);
        const fallbackSubMap = this.commandsByLocale.get(this.translatorManager!.fallbackLocale)!;
        const subMap = translatorSubMap?.has(path[0]) || !allowFallback
            ? translatorSubMap!
            : fallbackSubMap;

        const result = _traverseTree(path,
            subMap,
            v => v instanceof Map ? v : null,
            true);
        return result && !(result instanceof Map) ? result : null;
    }

    /**
     * Returns the given command's usage string.
     * @param command - Command to give the usage string to.
     * @param prefix - Prefix to place in front of command string.
     * @param translator - Translator to use for localization.
     * @returns Usage string.
     */
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
