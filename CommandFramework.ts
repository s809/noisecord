import { Command } from "./definitions";
import { Translator } from "./Translator";
import { CommandRegistry } from "./CommandRegistry";
import { TranslatorManager, TranslatorManagerOptions } from "./TranslatorManager";
import { traverseTree } from "./util";
import { ApplicationCommandManager } from "./ApplicationCommandManager";

interface CommandFrameworkOptions {
    commandModuleDirectory: string;
    contextMenuModuleDirectory: string;
    translationOptions: TranslatorManagerOptions;
}

export class CommandFramework {
    get commands(): ReadonlyMap<string, Readonly<Command>> {
        if (!this.commandRegistry)
            throw new Error(`${this.init.name}() was not called before use of ${this.constructor.name} instance.`);
        return this.commandRegistry.commands;
    }
    private commandRegistry?: CommandRegistry;

    private translatorManager?: TranslatorManager;

    private applicationCommandManager?: ApplicationCommandManager;

    constructor(private options: CommandFrameworkOptions) {}

    async init() {
        this.translatorManager = await new TranslatorManager(this.options.translationOptions).init();
        this.commandRegistry = await new CommandRegistry(this.options.commandModuleDirectory, this.translatorManager).createCommands();
        this.applicationCommandManager = await new ApplicationCommandManager(this.options.contextMenuModuleDirectory, this.translatorManager).init();

        return this;
    }

    /**
     * Resolves command by its path.
     *
     * @param path Path to command.
     * @param allowPartialResolve Whether to allow resolving to closest match.
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

        const translatorSubMap = this.commandRegistry!.commandsByLocale.get(translator.localeString)!;
        const fallbackSubMap = this.commandRegistry!.commandsByLocale.get(this.translatorManager!.fallbackLocale)!;
        const subMap = translatorSubMap.has(path[0]) || !allowFallback
            ? translatorSubMap
            : fallbackSubMap;
        
        const result = traverseTree(path,
            subMap,
            v => v instanceof Map ? v : null,
            true);
        return result && !(result instanceof Map) ? result : null;
    }

    /**
     * Recursively iterates commands.
     */
    iterateCommands() {
        return this.commandRegistry!.iterateCommands();
    }
}
