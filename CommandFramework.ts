import { pathToFileURL } from "url";
import { importModules } from "./importHelper";
import { Command, CommandDefinition } from "./definitions";
import { LocaleString } from "discord.js";
import { Translator } from "./Translator";
import { CommandRegistry, CommandRegistryOptions } from "./CommandRegistry";
import { TranslatorManager, TranslatorManagerOptions } from "./TranslatorManager";

interface CommandFrameworkOptions {
    commandRegistryOptions: CommandRegistryOptions;
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

    constructor(private options: CommandFrameworkOptions) {}

    async init() {
        this.translatorManager = await new TranslatorManager(this.options.translationOptions).init();
        this.commandRegistry = await new CommandRegistry(this.options.commandRegistryOptions, this.translatorManager).initCommands();
        this.prepareSubcommandsByLocale(this.commandRegistry, this.commandsByLocale);

        return this;
    }

    private prepareSubcommandsByLocale(map: Map<string, Command>, toFill: Command["subcommandsByLocale"]) {
        for (const command of map.values()) {
            for (const [locale, name] of Object.entries(command.nameTranslations)) {
                (toFill[locale as LocaleString] ??= new Map()).set(name, command);

                let map2 = this.commands;
                const localizedCommandPath = command.path.split("/").map(a => {
                    const c = map2.get(a)!;
                    map2 = c.subcommands;
                    return c.nameTranslations[locale as LocaleString];
                }).join(" ");

                const localizedArgs = command.args.stringTranslations[locale as LocaleString] ?? "";
                command.args.stringTranslations[locale as LocaleString] = `${localizedCommandPath} ${localizedArgs}`.trimEnd();
            }

            this.prepareSubcommandsByLocale(command.subcommands, command.subcommandsByLocale);
        }
    }

    resolveCommandByPath(path: string | string[], allowPartialResolve: boolean = false): Command | null {
        return this.resolveCommandInternal(path,
            this.commands,
            command => command.subcommands,
            allowPartialResolve);
    }

    resolveCommandByLocalizedPath(path: string | string[], translator: Translator): Command | null {
        const { fallbackTranslator } = this.translatorManager!;

        return this.resolveCommandInternal(path,
            translator.getTranslationFromRecord(this.commandsByLocale),
            command => translator.getTranslationFromRecord(command.subcommandsByLocale),
            true)
            ?? this.resolveCommandInternal(path,
                fallbackTranslator.getTranslationFromRecord(this.commandsByLocale),
                command => fallbackTranslator.getTranslationFromRecord(command.subcommandsByLocale),
                true);
    }

    /**
     * Resolves command by its path.
     *
     * @param path Path to command.
     * @param allowPartialResolve Whether to allow resolving to closest match.
     * @returns Command, if it was found.
     */
    private resolveCommandInternal(path: string | string[],
        root: ReadonlyMap<string, Command>,
        getSubcommands: (command: Command) => Map<string, Command>,
        allowPartialResolve: boolean = false): Command | null {
        if (!Array.isArray(path))
            path = path.split("/");

        let command;
        let list: ReadonlyMap<string, Command> | undefined = root;
        do {
            let found: Command | undefined = list.get(path[0]);
            if (!found)
                break;

            command = found;

            list = getSubcommands(command);
            path.shift();
        } while (list);

        if (!allowPartialResolve && path.length)
            return null;

        return command ?? null;
    }

    /**
     * Recursively iterates commands.
     */
    *iterateCommands() {
        for (let command of this.iterateSubcommands(this.commands))
            yield command;
    }

    /**
     * Recursively iterates a map with commands.
     *
     * @param list List of commands to iterate.
     */
    *iterateSubcommands(list: ReadonlyMap<string, Command>): Iterable<Command> {
        for (let command of list.values()) {
            yield command;

            if (command.subcommands) {
                for (let subcommand of this.iterateSubcommands(command.subcommands))
                    yield subcommand;
            }
        }
    }
}
