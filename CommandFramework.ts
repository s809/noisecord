import { pathToFileURL } from "url";
import { importModules } from "./importHelper";
import { Command, CommandDefinition } from "./definitions";
import { LocaleString } from "discord.js";
import { PrefixedTranslator, Translator } from "./Translator";
import { prepareSubcommands } from "./prepareSubcommands";

interface CommandFrameworkOptions {
    translationFileDirectory: string;
    commandModuleDirectory: string;
    contextMenuModuleDirectory: string;
}

export class CommandFramework {
    get commands(): ReadonlyMap<string, Readonly<Command>> {
        if (!this._commands)
            throw new Error(`${this.init.name}() was not called before use of ${this.constructor.name} instance.`);
        return this._commands;
    }
    private _commands?: Map<string, Command>;
    private commandsByLocale = {} as Command["subcommandsByLocale"];

    constructor(private options: CommandFrameworkOptions) { }

    async init() {
        const rootDefinitions = await importModules<CommandDefinition>(pathToFileURL(`${this.options.commandModuleDirectory}/*`).toString());
        this._commands = await prepareSubcommands(rootDefinitions);
        this.prepareSubcommandsByLocale(this._commands, this.commandsByLocale);
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

    resolveCommand(path: string | string[], allowPartialResolve: boolean = false): Command | null {
        return this.resolveCommandInternal(path,
            this.commands,
            command => command.subcommands,
            allowPartialResolve);
    }

    resolveCommandLocalized(path: string | string[], translator: Translator | PrefixedTranslator): Command | null {
        return this.resolveCommandInternal(path,
            translator.getTranslationFromRecord(this.commandsByLocale),
            command => translator.getTranslationFromRecord(command.subcommandsByLocale),
            true)
            ?? this.resolveCommandInternal(path,
                this.commandsByLocale[defaults.locale],
                command => command.subcommandsByLocale[defaults.locale],
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
