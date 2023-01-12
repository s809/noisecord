import { PermissionResolvable } from "discord.js";
import { CommandCondition } from "./conditions";
import { Command, CommandDefinition } from "./definitions";
import { ApplicationCommandOptionType, LocaleString, PermissionFlagsBits } from "discord.js";
import { TranslatorManager } from "./TranslatorManager";
import { castArray, isNil } from "lodash-es";

export interface InheritableOptions {
    path: string;
    conditions: CommandCondition[];
    interactionCommand: Command["interactionCommand"];
    ownerOnly: boolean;
    defaultMemberPermissions: PermissionResolvable;
    allowDMs: boolean;
}

export function createCommand(definition: CommandDefinition): Partial<Command> {
    return {
        // Specific to this command
        key: definition.key,

        handler: definition.handler ?? null,
        alwaysReactOnSuccess: definition.alwaysReactOnSuccess ?? false,

        conditions: castArray(definition.conditions),

        subcommands: new Map(),

        // Inherited
        interactionCommand: !isNil(definition.interactionCommand)
            ? {
                id: null
            }
            : definition.interactionCommand,
        defaultMemberPermissions: definition.defaultMemberPermissions!,
        allowDMs: definition.allowDMs,
        ownerOnly: definition.ownerOnly
    };
}

export class CreateCommandUtil {
    private errorContents = "";
    private errorCount = 0;

    private headerChain: string[] = ["(vibe check)"];
    private indent = 0;

    constructor(private translatorManager: TranslatorManager) { }

    throwIfErrors() {
        if (!this.errorContents.length) return;

        throw new Error(
            "Failed to initialize commands.\n" +
            this.errorContents + "\n" +
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
            if (this.indent === 0)
                this.errorContents += "\n";

            this.errorContents += indentString.repeat(this.indent) + header + ":\n";
            this.indent++;
        }

        this.errorContents += indentString.repeat(this.indent - 1) + "  - " + message + "\n";
        this.errorCount++;
    }

    private checkLocalizations(a: any, b: any, name: string, name2?: string) {
        for (const key of Object.keys(b)) {
            if (!a[key]) {
                this.addError(`Missing ${name} in locale ${key}`);
                a[key] = "_MISSING";
            }
        }
        for (const key of Object.keys(a)) {
            if (!b[key]) {
                this.addError(`Missing ${name2 ?? name} in locale ${key}`);
                b[key] = "_MISSING";
            }
        }
    };

    fillInheritableOptions(partialCommand: Partial<Command>, inheritedOptions?: InheritableOptions) {
        if (inheritedOptions) {
            partialCommand.conditions!.push(...inheritedOptions.conditions);

            if (partialCommand.interactionCommand && !inheritedOptions.interactionCommand)
                this.addError("Subcommands cannot be explicitly set as usable as interaction commands.");
            partialCommand.interactionCommand = inheritedOptions.interactionCommand;

            if (partialCommand.defaultMemberPermissions)
                this.addError("Subcommands cannot define default member permissions.");
            partialCommand.defaultMemberPermissions = inheritedOptions.defaultMemberPermissions;

            if (partialCommand.allowDMs !== undefined)
                this.addError("Subcommands cannot define DM permission.");
            partialCommand.allowDMs = inheritedOptions.allowDMs;

            if (!partialCommand.ownerOnly && inheritedOptions.ownerOnly)
                this.addError("Owner-only categories cannot contain not owner-only commands.");
            partialCommand.ownerOnly = inheritedOptions.ownerOnly;
        } else {
            partialCommand.defaultMemberPermissions ??= PermissionFlagsBits.UseApplicationCommands;
            partialCommand.allowDMs ??= true;
            partialCommand.ownerOnly ??= false;
        }

        if (partialCommand.ownerOnly && partialCommand.interactionCommand)
            this.addError("Owner-only commands cannot be usable as application commands.");
    }

    fillTranslations(partialCommand: Partial<Command>) {
        const translationPath = `commands.${partialCommand.path!.replaceAll("/", "_")}`;
        partialCommand.translationPath = translationPath;

        const nameTranslations = this.translatorManager.getLocalizations(`${translationPath}.name`);
        const descriptionTranslations = this.translatorManager.getLocalizations(`${translationPath}.description`);
        
        if (!nameTranslations[this.translatorManager.fallbackLocale] && !descriptionTranslations[this.translatorManager.fallbackLocale]) {
            this.addError(`Command is missing a name and description in default locale (${this.translatorManager.fallbackLocale}).`);
            nameTranslations[this.translatorManager.fallbackLocale] = "_MISSING";
            descriptionTranslations[this.translatorManager.fallbackLocale] = "_MISSING";
        }
        this.checkLocalizations(nameTranslations, descriptionTranslations, "command name", "command description");

        let nextLevel = this.headerChain.length;
        this.setHeader(nextLevel++, "Name translations");
        for (const [localeString, nameTranslation] of Object.entries(nameTranslations)) {
            this.setHeader(nextLevel, localeString);

            const regex = /^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u;
            if (!nameTranslation.match(regex))
                this.addError(`Name translation "${nameTranslation}" does not match the regex: ${regex}`);
        }

        partialCommand.nameTranslations = nameTranslations as any;
        partialCommand.descriptionTranslations = descriptionTranslations as any;
    }

    fillArguments(partialCommand: Partial<Command>,
        args: CommandDefinition["args"]) {        
        let minArgs = 0;
        let maxArgs = 0;
        let lastArgAsExtras = false;
        let optionalArgsStarted = false;

        const argStringTranslations = {} as Record<LocaleString, string>;

        const nextLevel = this.headerChain.length;
        const convertedArgs = args?.map(arg => {
            this.setHeader(nextLevel, `Argument: ${arg.key}`);

            const argTranslationPath = `${partialCommand.translationPath}.args.${arg.key}`;

            // Make sure that argument's translation is consistent with command's translation.
            const nameLocalizations = this.translatorManager.getLocalizations(`${argTranslationPath}.name`);
            const descriptionLocalizations = this.translatorManager.getLocalizations(`${argTranslationPath}.description`);
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
                    this.addError("Extras argument must be of a string type.");
                if (arg.required === false)
                    this.addError("Extras argument cannot be optional.");

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

                name: nameLocalizations[this.translatorManager.fallbackLocale],
                nameLocalizations,
                description: descriptionLocalizations[this.translatorManager.fallbackLocale],
                descriptionLocalizations,
                choices: arg.choices?.map(choice => {
                    this.setHeader(nextLevel + 1, `Choice: ${choice.key}`);

                    const nameLocalizations = this.translatorManager.getLocalizations(`${argTranslationPath}.choices.${choice.key}.name`);
                    this.checkLocalizations(partialCommand.nameTranslations, nameLocalizations, "choice name");

                    return {
                        name: nameLocalizations[this.translatorManager.fallbackLocale],
                        nameLocalizations,
                        value: choice.value
                    };
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
