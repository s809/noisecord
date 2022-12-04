import { PermissionResolvable } from "discord.js";
import { CommandCondition } from "./conditions";
import { Command, CommandDefinition } from "./definitions";
import { ApplicationCommandOptionType, LocaleString, PermissionFlagsBits } from "discord.js";
import { TranslatorManager } from "./TranslatorManager";

export interface InheritableOptions {
    path: string;
    conditions: CommandCondition[];
    usableAsAppCommand: boolean;
    ownerOnly: boolean;
    defaultMemberPermissions: PermissionResolvable;
    allowDMs: boolean;
}

export function createCommand(definition: CommandDefinition): Partial < Command > {
    return {
        // Specific to this command
        key: definition.key,

        appCommandId: null,

        handler: definition.handler ?? null,
        alwaysReactOnSuccess: definition.alwaysReactOnSuccess ?? false,

        conditions: Array.isArray(definition.conditions)
            ? definition.conditions
            : definition.conditions ? [definition.conditions] : [],

        subcommands: new Map(),

        // Inherited
        usableAsAppCommand: definition.usableAsAppCommand,
        defaultMemberPermissions: definition.defaultMemberPermissions!,
        allowDMs: definition.allowDMs,
        ownerOnly: definition.ownerOnly
    };
}

export class CreateCommandUtil {
    private errorContents = "";
    private errorCount = 0;

    private headerChain: string[] = [];
    private indent = 0;

    throwIfErrors() {
        if (!this.errorContents.length) return;

        throw new Error(
            "Failed to initialize commands.\n" +
            this.errorContents +
            `Errors generated: ${this.errorCount}`
        );
    }

    setHeader(level: number, header: string) {
        this.headerChain.splice(level, this.headerChain.length, header);
        if (this.indent > level)
            this.indent = level;
    }

    private addError(message: string) {
        const indentString = "    ";

        for (const header of this.headerChain.slice(this.indent)) {

            this.errorContents += indentString.repeat(this.indent) + header + ":\n";
            this.indent++;
        }

        this.errorContents += indentString.repeat(this.indent) + message + "\n";
        this.errorCount++;
    }

    private checkLocalizations(a: any, b: any, name: string, name2?: string) {
        for (const key of Object.keys(b)) {
            if (!(key in a))
                this.addError(`Missing ${name} in locale ${key}`);
        }
        for (const key of Object.keys(a)) {
            if (!(key in b))
                this.addError(`Missing ${name2 ?? name} in locale ${key}`);
        }
    };

    fillInheritableOptions(partialCommand: Partial<Command>, inheritedOptions?: InheritableOptions) {
        if (inheritedOptions) {
            partialCommand.conditions!.push(...inheritedOptions.conditions);

            if (partialCommand.usableAsAppCommand)
                this.addError("Subcommands can only be unmarked as usable as application commands.");
            partialCommand.usableAsAppCommand = inheritedOptions.usableAsAppCommand;

            if (partialCommand.defaultMemberPermissions)
                this.addError("Subcommands cannot define default member permissions.");
            partialCommand.defaultMemberPermissions = inheritedOptions.defaultMemberPermissions;

            if (partialCommand.allowDMs !== undefined)
                this.addError("Subcommands cannot define DM permission.");
            partialCommand.allowDMs = inheritedOptions.allowDMs;

            if (!partialCommand.ownerOnly && inheritedOptions.ownerOnly)
                this.addError("Owner-only category cannot contain not owner-only commands.");
            partialCommand.ownerOnly = inheritedOptions.ownerOnly;
        } else {
            partialCommand.usableAsAppCommand ??= false;
            partialCommand.defaultMemberPermissions ??= PermissionFlagsBits.UseApplicationCommands;
            partialCommand.allowDMs ??= true;
            partialCommand.ownerOnly ??= false;
        }

        if (partialCommand.ownerOnly && partialCommand.usableAsAppCommand)
            this.addError("Owner-only commands cannot be usable as app commands.");
    }

    fillTranslations(partialCommand: Partial<Command>, translatorManager: TranslatorManager) {
        const translationPath = `commands.${partialCommand.path!.replaceAll("/", "_")}`;
        partialCommand.translationPath = translationPath;

        const nameTranslations = translatorManager.getLocalizations(`${translationPath}.name`);
        const descriptionTranslations = translatorManager.getLocalizations(`${translationPath}.description`);
        if (!nameTranslations[translatorManager.fallbackLocale])
            this.addError(`Command "${partialCommand.path}" is missing a name in default locale (${translatorManager.fallbackLocale}).`);
        this.checkLocalizations(nameTranslations, descriptionTranslations, "command name", "command description");
    }

    fillArguments(partialCommand: Partial<Command>,
        args: CommandDefinition["args"],
        translatorManager: TranslatorManager) {        
        let minArgs = 0;
        let maxArgs = 0;
        let lastArgAsExtras = false;
        let optionalArgsStarted = false;

        const argStringTranslations = {} as Record<LocaleString, string>;

        const lastLevel = this.headerChain.length;
        const convertedArgs = args?.map(arg => {
            this.setHeader(lastLevel, `Argument key: ${arg.translationKey}`);

            const argTranslationPath = `${partialCommand.translationPath}.args.${arg.translationKey}`;

            // Make sure that argument's translation is consistent with command's translation.
            const nameLocalizations = translatorManager.getLocalizations(`${argTranslationPath}.name`);
            const descriptionLocalizations = translatorManager.getLocalizations(`${argTranslationPath}.description`);
            this.checkLocalizations(partialCommand.nameTranslations, nameLocalizations, "argument name");
            this.checkLocalizations(partialCommand.nameTranslations, descriptionLocalizations, "argument description");

            if (arg.required === false)
                optionalArgsStarted = true; // If an optional argument is found, all following arguments are optional.
            else if (optionalArgsStarted)
                this.addError("Optional arguments must be defined after all required arguments.");

            else
                minArgs++;
            maxArgs++;

            if (lastArgAsExtras)
                this.addError("Extras argument must be the last argument.");
            if (arg.isExtras) {
                if (arg.type !== ApplicationCommandOptionType.String)
                    this.addError("Extras argument type must be a string.");
                if (arg.required === false)
                    this.addError("Command with extras argument cannot have optional arguments.");

                lastArgAsExtras = true;
                maxArgs = Infinity;
            }

            for (const [locale, translation] of Object.entries(nameLocalizations)) {
                const argString = arg.required !== false
                    ? `<${translation}${arg.isExtras ? "..." : ""}>`
                    : `[${translation}]`;

                if (!argStringTranslations[locale as LocaleString])
                    argStringTranslations[locale as LocaleString] = argString;

                else
                    argStringTranslations[locale as LocaleString] += ` ${argString}`;
            }

            return {
                ...arg,

                name: nameLocalizations[translatorManager.fallbackLocale],
                nameLocalizations,
                description: descriptionLocalizations[translatorManager.fallbackLocale],
                descriptionLocalizations,
                choices: arg.choices?.map(choice => {
                    try {
                        const nameLocalizations = translatorManager.getLocalizations(`${argTranslationPath}.choices.${choice.translationKey}.name`);
                        this.checkLocalizations(partialCommand.nameTranslations, nameLocalizations, "choice name");

                        return {
                            name: nameLocalizations[translatorManager.fallbackLocale],
                            nameLocalizations,
                            value: choice.value
                        };
                    } catch (e) {
                        e.message += `\nChoice: ${choice.translationKey}`;
                        throw e;
                    }
                }),
                required: arg.required ?? true,
            };
        }) as Command["args"]["list"] ?? [];

        return {
            list: convertedArgs,
            min: minArgs,
            max: maxArgs,
            stringTranslations: argStringTranslations,
            lastArgAsExtras
        };
    }
}
