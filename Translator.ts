import { CommandInteraction, Guild, GuildResolvable, LocaleString, Message, User } from "discord.js";
import { readdirSync, readFileSync } from "fs";
import { get } from "lodash-es";
import format from "string-format";

const defaultDiscordLocale: LocaleString = "en-US";

export class PrefixedTranslator {
    readonly translator: Translator;
    private prefix: string;

    static get translators(): ReadonlyMap<LocaleString, ReadonlyMap<string, PrefixedTranslator>> {
        return this._translators;
    }
    private static _translators = new Map<LocaleString, Map<string, PrefixedTranslator>>();

    constructor(translator: Translator, prefix: string) {
        this.translator = translator;
        this.prefix = prefix;

        let byLocale = PrefixedTranslator._translators.get(translator.localeString);
        if (!byLocale) {
            byLocale = new Map();
            PrefixedTranslator._translators.set(translator.localeString, byLocale);
        }
        byLocale.set(prefix, this);
    }

    get localeString() {
        return this.translator.localeString;
    }

    translate(path: string, ...args: FormatParameters) {
        return this.translator.tryTranslate(`${this.prefix}.${path}`, ...args)
            ?? Translator.fallbackTranslator.tryTranslate(`${this.prefix}.${path}`, ...args)
            ?? this.translator.translate(path, ...args);
    };
}

type NameOrContext = string | Message | CommandInteraction | GuildResolvable | User;
type FormatParameters = Parameters<typeof format>[1][];
export class Translator {
    readonly localeString: LocaleString;
    readonly setLanguageRegex: RegExp;
    readonly booleanValues: [string[], string[]];

    private data: object;

    static get fallbackTranslator() {
        const translator = this._translators.get(defaults.locale);
        if (!translator)
            throw new Error("Default translator is not initialized.");
        return translator;
    }

    static get translators(): ReadonlyMap<string, Translator> {
        return Translator._translators;
    }
    private static _translators: Map<string, Translator> = new Map();

    static {
        const translationDir = "./translations/";

        for (let file of readdirSync(translationDir))
            new Translator(translationDir + file, file.split(".")[0] as LocaleString);
    }
    
    constructor(path: string, localeString: LocaleString) {
        this.data = JSON.parse(readFileSync(path, "utf8"));

        this.booleanValues = get(this.data, "boolean_values");

        Translator._translators.set(localeString, this);
    }

    static async getLanguage(nameOrContext: NameOrContext): Promise<string> {
        if (typeof nameOrContext === "string")
            return nameOrContext;
        
        /*
        if should use guild:
            use guild's locale ?? owner's locale
        if shoule use user:
            if overridden:
                use override
            else:
                if provided == default discord:
                    use default bot // need of use provided == default solved by override
                else:
                    use provided ?? default bot
        */
        
        let user: User | undefined;
        let interactionLocale: LocaleString | undefined;
        let guild: Guild | null | undefined;

        if (nameOrContext instanceof CommandInteraction) {
            if (!guild || (nameOrContext.ephemeral ?? true)) {
                user = nameOrContext.user;
                interactionLocale = nameOrContext.locale;
            } else {
                guild = nameOrContext.guild;
            }
        } else if (nameOrContext instanceof Guild) {
            guild = nameOrContext;
        } else if (nameOrContext instanceof User) {
            user = nameOrContext;
        } else if (nameOrContext instanceof Message) {
            if (nameOrContext.channel.isDMBased())
                user = nameOrContext.author;
            else
                guild = nameOrContext.guild;
        } else if (nameOrContext.guild) {
            guild = nameOrContext.guild as Guild;
        }

        if (user) {
            return (await DbUser.findByIdOrDefault(user.id, { language: 1 })).language
                ?? (interactionLocale !== defaultDiscordLocale ? interactionLocale : null)
                ?? defaults.locale;
        } else if (guild) {
            return (await DbGuild.findByIdOrDefault(guild.id, { language: 1 })).language ?? Translator.getLanguage((await guild.fetchOwner()).user);
        } else {
            throw new Error("Invalid context.");
        }
    }

    /**
     * @see Translator.getOrDefault
     */
    static async get(nameOrContext: NameOrContext): Promise<Translator | null> {
        return Translator._translators.get(await this.getLanguage(nameOrContext)) ?? null;
    }

    /**
     * Returns a translator by language name or given context.
     * 
     * @param nameOrContext Message or name to use.
     */
    static async getOrDefault(nameOrContext: NameOrContext): Promise<Translator>;
    
    /**
     * Returns a translator by language name or given context.
     * 
     * @param nameOrContext Message or name to use.
     * @param prefix Prefix to use with returned instance.
     */
    static async getOrDefault(nameOrContext: NameOrContext, prefix: string): Promise<PrefixedTranslator>;

    static async getOrDefault(nameOrContext: NameOrContext, prefix?: string): Promise<PrefixedTranslator | Translator> {
        const translator = await Translator.get(nameOrContext) ?? Translator.fallbackTranslator;
        if (!prefix)
            return translator;
        
        const prefixedTranslator = PrefixedTranslator.translators.get(translator.localeString)?.get(prefix);
        if (!prefixedTranslator)
            return new PrefixedTranslator(translator, prefix);
        return prefixedTranslator;
    }

    static getLocalizations(translationPath: string) {
        return Object.fromEntries([...Translator.translators.values()]
            .map(t => [t.localeString, t.tryTranslate(translationPath)] as [LocaleString, string | null])
            .filter(([, translation]) => translation !== null)) as Record<LocaleString, string>;
    }

    /**
     * Get a translation string.
     * 
     * @param path Path of translation entry.
     * @param args Arguments for string interpolation.
     * @returns String with translation or passed path, if it was not found.
     */
    translate(path: string, ...args: FormatParameters): string {
        return this.tryTranslate(path, ...args)
            ?? Translator.fallbackTranslator.tryTranslate(path, ...args)
            ?? path;
    }

    /**
     * Get a translation string.
     * 
     * @param path Path of translation entry.
     * @param args Arguments for string interpolation.
     * @returns String with translation or null, if it was not found.
     */
    tryTranslate(path: string, ...args: FormatParameters): string | null {
        var source = get(this.data, path);
        return source ? format(source, ...args) : null;
    }

    /**
     * Gets a translation value from object using this translator's locale string as a key.
     * Tries to get result by a default locale key if this translator's key was not found.
     * 
     * @param obj Object to get value from.
     * @returns Value from object or undefined.
     */
    getTranslationFromRecord(obj: Partial<Record<LocaleString, any>>) {
        return obj[this.localeString] ?? obj[defaults.locale];
    }
}
