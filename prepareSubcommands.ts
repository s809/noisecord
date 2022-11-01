import { importModules } from "./importHelper";
import { Command, CommandDefinition } from "./definitions";
import { ApplicationCommandOptionType, LocaleString, PermissionFlagsBits, PermissionResolvable } from "discord.js";
import { CommandCondition } from "./conditions";
import { Translator } from "./Translator";

interface InheritableOptions {
    path: string;
    conditions: CommandCondition[];
    usableAsAppCommand: boolean;
    ownerOnly: boolean;
    defaultMemberPermissions: PermissionResolvable;
    allowDMs: boolean;
}

export async function prepareSubcommands(list: [string, CommandDefinition][], inheritedOptions?: InheritableOptions): Promise<Map<string, Command>> {
    const map = new Map<string, Command>();

    const checkLocalizations = (a: any, b: any, name: string, name2?: string) => {
        for (const key of Object.keys(b)) {
            if (!(key in a))
                throw new Error(`Missing ${name} in locale ${key}`);
        }
        for (const key of Object.keys(a)) {
            if (!(key in b))
                throw new Error(`Missing ${name2 ?? name} in locale ${key}`);
        }
    };

    for (const [filePath, definition] of list.values() as IterableIterator<[string, CommandDefinition]>) {
        const options: InheritableOptions = {
            conditions: inheritedOptions?.conditions.slice() ?? [],
            path: inheritedOptions?.path
                ? `${inheritedOptions.path}/${definition.key}`
                : definition.key,
            usableAsAppCommand: inheritedOptions?.usableAsAppCommand ?? false,
            ownerOnly: inheritedOptions?.ownerOnly ?? false,
            defaultMemberPermissions: inheritedOptions?.defaultMemberPermissions ?? PermissionFlagsBits.UseApplicationCommands,
            allowDMs: inheritedOptions?.allowDMs ?? true
        };

        try {
            const translationPath = `commands.${options.path.replaceAll("/", "_")}`;

            configureInheritableOptions(definition, options);

            // Make sure that command is fully translated.
            const nameTranslations = Translator.getLocalizations(`${translationPath}.name`);
            const descriptionTranslations = Translator.getLocalizations(`${translationPath}.description`);
            checkLocalizations(nameTranslations, descriptionTranslations, "command name", "command description");
            if (!nameTranslations[defaults.locale])
                throw new Error("Command is not translated to the default locale.");

            const aaaa = convertDefinitionArgs(definition.args, translationPath, checkLocalizations, nameTranslations);

            map.set(definition.key, {
                key: definition.key,

                translationPath,
                nameTranslations,
                descriptionTranslations,
                usageTranslations: {} as Command["usageTranslations"],

                ...options,
                appCommandId: null,

                args: aaaa,
                handler: definition.handler ?? null,
                alwaysReactOnSuccess: definition.alwaysReactOnSuccess ?? false,

                subcommands: !filePath.endsWith(".js")
                    ? await prepareSubcommands(await importModules<CommandDefinition>(`${filePath}/*`), options)
                    : new Map(),
                subcommandsByLocale: {} as Command["subcommandsByLocale"] // initialized by call to function below
            });
        } catch (e) {
            if (!e.message.includes("\nPath: "))
                e.message += `\nPath: ${options.path}`;
            throw e;
        }
    }

    return map;
}

function configureInheritableOptions(definition: CommandDefinition, options: InheritableOptions) {
    if (definition.conditions) {
        const requirements = Array.isArray(definition.conditions)
            ? definition.conditions
            : [definition.conditions];

        options.conditions.push(...requirements);
    }

    if (definition.defaultMemberPermissions && options.path.includes("/"))
        throw new Error("Subcommands cannot define default member permissions.");

    // If a command is marked as usable as app command, this mark
    // is inherited to all subcommands unless overridden later.
    if (definition.usableAsAppCommand !== undefined) {
        if (definition.usableAsAppCommand && options.path.includes("/"))
            throw new Error("Only root commands can be marked as usable as app commands.");

        options.usableAsAppCommand = definition.usableAsAppCommand;
    }

    if (definition.ownerOnly !== undefined) {
        if (definition.ownerOnly && options.usableAsAppCommand)
            throw new Error("Owner-only commands cannot be marked as usable as app commands.");
        if (!definition.ownerOnly && options.ownerOnly)
            throw new Error("Owner-only category cannot contain not owner-only commands.");

        options.ownerOnly = definition.ownerOnly;
    }

    // Root command-only properties.
    for (const property of ["defaultMemberPermissions", "allowDMs"]) {
        if ((definition as any)[property] === undefined)
            continue;

        if (options.path.includes("/"))
            throw new Error(`Subcommands cannot have property: ${property}`);

        (options as any)[property] = (definition as any)[property];
    }
}

function convertDefinitionArgs(args: CommandDefinition["args"],
    translationPath: string,
    checkLocalizations: (a: any, b: any, name: string, name2?: string) => void,
    commandNameTranslations: Record<LocaleString, string>
) {
    let minArgs = 0;
    let maxArgs = 0;
    let lastArgAsExtras = false;
    let optionalArgsStarted = false;

    const argStringTranslations = {} as Record<LocaleString, string>;

    const convertedArgs = args?.map(arg => {
        try {
            // Make sure that argument's translation is consistent with command's translation.
            const nameLocalizations = Translator.getLocalizations(`${translationPath}.args.${arg.translationKey}.name`);
            const descriptionLocalizations = Translator.getLocalizations(`${translationPath}.args.${arg.translationKey}.description`);
            checkLocalizations(commandNameTranslations, nameLocalizations, "argument name");
            checkLocalizations(commandNameTranslations, descriptionLocalizations, "argument description");

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

                name: nameLocalizations[defaults.locale],
                nameLocalizations,
                description: descriptionLocalizations[defaults.locale],
                descriptionLocalizations,
                choices: arg.choices?.map(choice => {
                    try {
                        const nameLocalizations = Translator.getLocalizations(`${translationPath}.args.${arg.translationKey}.choices.${choice.translationKey}.name`);
                        checkLocalizations(commandNameTranslations, nameLocalizations, "choice name");

                        return {
                            name: nameLocalizations[defaults.locale],
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
        list: convertedArgs ?? [],
        min: minArgs,
        max: maxArgs,
        stringTranslations: argStringTranslations,
        lastArgAsExtras
    };
}
