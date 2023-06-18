import { PermissionResolvable } from "discord.js";
import { CommandCondition } from "../conditions/index.js";
import { Command, CommandDefinition } from "../interfaces/Command.js";
import { ApplicationCommandOptionType, LocaleString, PermissionFlagsBits } from "discord.js";
import { TranslatorManager } from "../translations/TranslatorManager.js";
import { castArray } from "lodash-es";
import { ErrorCollector } from "./ErrorCollector.js";
import assert from "assert";

export namespace CommandCreationHelper {
    export interface InheritableOptions {
        path: string;
        conditions: CommandCondition[];
        interactionCommand: Command["interactionCommand"];
        ownerOnly: boolean;
        defaultMemberPermissions: PermissionResolvable;
        allowDMs: boolean;
    }
}

export class CommandCreationHelper extends ErrorCollector {
    constructor(private translatorManager: TranslatorManager, private requireTranslations: boolean) {
        super("while creating commands");
    }

    createCommand(definition: CommandDefinition): Partial<Command> {
        return {
            // Specific to this command
            key: definition.key,

            handler: definition.handler ?? null,

            conditions: definition.conditions
                ? castArray(definition.conditions)
                : [],

            subcommands: new Map(),

            // Inherited
            interactionCommand: !definition.ownerOnly
                ? {
                    id: null
                }
                : null,
            defaultMemberPermissions: definition.defaultMemberPermissions!,
            allowDMs: definition.allowDMs,
            ownerOnly: definition.ownerOnly
        };
    }

    private checkLocalizations(a: any, b: any, context: string, name: string, name2?: string) {
        for (const key of Object.keys(b)) {
            if (!a[key]) {
                if (this.requireTranslations) {
                    this.addError(`Missing ${name} in locale ${key}`);
                    a[key] = "_MISSING";
                } else {
                    a[key] = `${context}_${name.replaceAll(" ", "_")}_${key}`;
                }
            }
        }
        for (const key of Object.keys(a)) {
            if (!b[key]) {
                if (this.requireTranslations) {
                    this.addError(`Missing ${name2 ?? name} in locale ${key}`);
                    b[key] = "_MISSING";
                } else {
                    b[key] = `${context}_${(name2 ?? name).replaceAll(" ", "_")}_${key}`;
                }
            }
        }
    };

    fillInheritableOptions(partialCommand: Partial<Command>, inheritedOptions?: CommandCreationHelper.InheritableOptions) {
        if (inheritedOptions) {
            partialCommand.conditions!.push(...inheritedOptions.conditions);

            if (partialCommand.defaultMemberPermissions !== undefined)
                this.addError("Non-root commands cannot define default member permissions.");
            partialCommand.defaultMemberPermissions = inheritedOptions.defaultMemberPermissions;

            if (![inheritedOptions.allowDMs, undefined].includes(partialCommand.allowDMs))
                this.addError("Non-root commands cannot define DM permission.");
            partialCommand.allowDMs = inheritedOptions.allowDMs;

            if (partialCommand.ownerOnly === false && inheritedOptions.ownerOnly)
                this.addError("Owner-only categories cannot contain not owner-only commands.");
            partialCommand.ownerOnly = inheritedOptions.ownerOnly;

            if (partialCommand.ownerOnly)
                partialCommand.interactionCommand = null;
        } else {
            partialCommand.defaultMemberPermissions ??= PermissionFlagsBits.UseApplicationCommands;
            partialCommand.allowDMs ??= true;
            partialCommand.ownerOnly ??= false;
        }

        assert(!(partialCommand.ownerOnly || partialCommand.interactionCommand) ||
            (!!partialCommand.ownerOnly !== !!partialCommand.interactionCommand));
    }

    checkTreeValidity(command: Command) {
        if (command.handler && command.subcommands.size)
            this.addError("Commands with subcommands cannot have a handler.");
        if (!command.handler && !command.subcommands.size)
            this.addError("Commands without subcommands must have a handler.");
    }

    fillTranslations(partialCommand: Partial<Command>, translationPath: string) {
        partialCommand.translationPath = translationPath;

        const nameTranslations = this.translatorManager.getLocalizations(`${translationPath}.name`);
        const descriptionTranslations = this.translatorManager.getLocalizations(`${translationPath}.description`);
        
        if (!nameTranslations[this.translatorManager.fallbackLocale] || !descriptionTranslations[this.translatorManager.fallbackLocale]) {
            if (this.requireTranslations) {
                this.addError(`Command is missing a name and description in default locale (${this.translatorManager.fallbackLocale}).`);
                nameTranslations[this.translatorManager.fallbackLocale] = "_MISSING";
                descriptionTranslations[this.translatorManager.fallbackLocale] = "_MISSING";
            } else {
                nameTranslations[this.translatorManager.fallbackLocale] = partialCommand.key;
                descriptionTranslations[this.translatorManager.fallbackLocale] = "No description available";
            }
        }
        this.checkLocalizations(nameTranslations, descriptionTranslations, partialCommand.key!, "command name", "command description");

        let nextLevel = this.groupChainLength;
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

        const nextLevel = this.groupChainLength;
        const convertedArgs = args?.map(arg => {
            this.setHeader(nextLevel, `Argument: ${arg.key}`);

            const argTranslationPath = `${partialCommand.translationPath}.args.${arg.key}`;

            // Make sure that argument's translation is consistent with command's translation.
            const nameLocalizations = this.translatorManager.getLocalizations(`${argTranslationPath}.name`);
            const descriptionLocalizations = this.translatorManager.getLocalizations(`${argTranslationPath}.description`);
            this.checkLocalizations(partialCommand.nameTranslations, nameLocalizations, arg.key, "argument name");
            this.checkLocalizations(partialCommand.nameTranslations, descriptionLocalizations, arg.key, "argument description");

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
                    this.checkLocalizations(partialCommand.nameTranslations, nameLocalizations, choice.key, "choice name");

                    return {
                        name: nameLocalizations[this.translatorManager.fallbackLocale],
                        nameLocalizations,
                        value: choice.value
                    };
                }),
                required: arg.required ?? true,
            };
        }) as Command["args"]["list"] ?? [];

        partialCommand.args = {
            list: convertedArgs,
            min: minArgs,
            max: maxArgs,
            stringTranslations: argStringTranslations,
            lastArgAsExtras
        };
    }
}
