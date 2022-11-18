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

function checkLocalizations(a: any, b: any, name: string, name2?: string) {
    for (const key of Object.keys(b)) {
        if (!(key in a))
            throw new Error(`Missing ${name} in locale ${key}`);
    }
    for (const key of Object.keys(a)) {
        if (!(key in b))
            throw new Error(`Missing ${name2 ?? name} in locale ${key}`);
    }
};

export function createCommand(definition: CommandDefinition): Partial<Command> {
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

export function fillInheritableOptions(partialCommand: Partial<Command>, inheritedOptions?: InheritableOptions) {
    if (inheritedOptions) {
        partialCommand.path = `${inheritedOptions.path}/${partialCommand.key}`;

        partialCommand.conditions!.push(...inheritedOptions.conditions);

        if (partialCommand.usableAsAppCommand)
            throw new Error("Subcommands can only be unmarked as usable as app commands.");
        partialCommand.usableAsAppCommand = inheritedOptions.usableAsAppCommand;

        if (partialCommand.defaultMemberPermissions)
            throw new Error("Subcommands cannot define default member permissions.");
        partialCommand.defaultMemberPermissions = inheritedOptions.defaultMemberPermissions;

        if (partialCommand.allowDMs !== undefined)
            throw new Error("Subcommands cannot define DM permission.");
        partialCommand.allowDMs = inheritedOptions.allowDMs;

        if (!partialCommand.ownerOnly && inheritedOptions.ownerOnly)
            throw new Error("Owner-only category cannot contain not owner-only commands.");
        partialCommand.ownerOnly = inheritedOptions.ownerOnly;
    } else {
        partialCommand.path = partialCommand.key;
        partialCommand.usableAsAppCommand ??= false;
        partialCommand.defaultMemberPermissions ??= PermissionFlagsBits.UseApplicationCommands;
        partialCommand.allowDMs ??= true;
        partialCommand.ownerOnly ??= false;
    }

    if (partialCommand.ownerOnly && partialCommand.usableAsAppCommand)
        throw new Error("Owner-only commands cannot be usable as app commands.");
}

export function fillTranslations(partialCommand: Partial<Command>, translatorManager: TranslatorManager) {
    const translationPath = `commands.${partialCommand.path!.replaceAll("/", "_")}`;
    partialCommand.translationPath = translationPath;

    const nameTranslations = translatorManager.getLocalizations(`${translationPath}.name`);
    const descriptionTranslations = translatorManager.getLocalizations(`${translationPath}.description`);
    checkLocalizations(nameTranslations, descriptionTranslations, "command name", "command description");
    if (!nameTranslations[translatorManager.fallbackLocale])
        throw new Error("Command is not translated to the default locale.");
}

export function fillArguments(partialCommand: Partial<Command>,
    args: CommandDefinition["args"],
    translatorManager: TranslatorManager) {
    let minArgs = 0;
    let maxArgs = 0;
    let lastArgAsExtras = false;
    let optionalArgsStarted = false;

    const argStringTranslations = {} as Record<LocaleString, string>;

    const convertedArgs = args?.map(arg => {
        try {
            const argTranslationPath = `${partialCommand.translationPath}.args.${arg.translationKey}`;

            // Make sure that argument's translation is consistent with command's translation.
            const nameLocalizations = translatorManager.getLocalizations(`${argTranslationPath}.name`);
            const descriptionLocalizations = translatorManager.getLocalizations(`${argTranslationPath}.description`);
            checkLocalizations(partialCommand.nameTranslations, nameLocalizations, "argument name");
            checkLocalizations(partialCommand.nameTranslations, descriptionLocalizations, "argument description");

            if (arg.required === false)
                optionalArgsStarted = true; // If an optional argument is found, all following arguments are optional.
            else if (optionalArgsStarted)
                throw new Error("Optional arguments must be defined after all required arguments.");

            else
                minArgs++;
            maxArgs++;

            if (lastArgAsExtras)
                throw new Error("Extras argument must be the last argument.");
            if (arg.isExtras) {
                if (arg.type !== ApplicationCommandOptionType.String)
                    throw new Error("Extras argument type must be a string.");
                if (arg.required === false)
                    throw new Error("Command with extras argument cannot have optional arguments.");

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
                        checkLocalizations(partialCommand.nameTranslations, nameLocalizations, "choice name");

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
        } catch (e) {
            e.message += `\nArgument: ${arg.translationKey}`;
            throw e;
        }
    }) as Command["args"]["list"] ?? [];

    return {
        list: convertedArgs,
        min: minArgs,
        max: maxArgs,
        stringTranslations: argStringTranslations,
        lastArgAsExtras
    };
}
