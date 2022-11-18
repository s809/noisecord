import { Command } from "./definitions";
import { Translator } from "./Translator";
import { CommandRegistry, CommandRegistryOptions } from "./CommandRegistry";
import { TranslatorManager, TranslatorManagerOptions } from "./TranslatorManager";
import { traverseTree } from "./util";
import { ApplicationCommandManager } from "./ApplicationCommandManager";
import { Client } from "discord.js";

export interface CommandFrameworkOptions {
    commandRegistryOptions: CommandRegistryOptions;
    translationOptions: TranslatorManagerOptions;
    registerApplicationCommands?: boolean;
}

export class CommandFramework {
    get commands(): ReadonlyMap<string, Readonly<Command>> {
        if (!this.commandRegistry)
            throw new Error(`${this.init.name}() was not called before use of ${this.constructor.name} instance.`);
        return this.commandRegistry.commands;
    }
    commandRegistry?: CommandRegistry;

    translatorManager?: TranslatorManager;

    applicationCommandManager?: ApplicationCommandManager;

    client?: Client;

    constructor(private options: CommandFrameworkOptions) {}

    async init(client: Client) {
        this.translatorManager = await new TranslatorManager(this.options.translationOptions).init();
        this.commandRegistry = await new CommandRegistry(this.options.commandRegistryOptions, this.translatorManager).createCommands();

        this.client = client;
        if (client.isReady())
            await this.afterClientLogin();
        else
            (client as Client<false>).once("ready", () => this.afterClientLogin());

        return this;
    }

    private async afterClientLogin() {
        this.applicationCommandManager = await new ApplicationCommandManager(this.commandRegistry!).init(this.client!);
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
