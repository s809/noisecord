import { CommandInteraction, Guild, GuildResolvable, LocaleString, Message, User } from "discord.js";
import { get } from "lodash-es";
import format from "string-format";

const defaultDiscordLocale: LocaleString = "en-US";

export type NameOrContext = string | Message | CommandInteraction | GuildResolvable | User;
type FormatParameters = Parameters<typeof format>[1][];
export class Translator {
    readonly localeString: LocaleString;
    readonly setLanguageRegex: RegExp;
    readonly booleanValues: [string[], string[]];

    private prefix: string | null;
    
    /** Translator of same locale without prefix. */
    readonly root: Translator | null;
    /** Translator of fallback locale with same prefix. */
    readonly fallback: Translator | null;

    constructor(data: object);
    constructor(data: object, prefix: string, root: Translator);
    constructor(data: object, fallback: Translator, root: Translator);
    constructor(data: object, prefixOrFallback: string | Translator, root: Translator);
    constructor(private data: object, prefixOrFallback?: string | Translator, root?: Translator) {
        this.localeString = get(this.data, "locale_string")!;
        this.setLanguageRegex = new RegExp(`^${get(this.data, "set_language_regex")}$`, "iu");
        this.booleanValues = get(this.data, "boolean_values")!;

        this.root = root ?? null;

        this.fallback = null;
        this.prefix = null;
        if (prefixOrFallback instanceof Translator) {
            this.fallback = prefixOrFallback;
            this.prefix = prefixOrFallback.prefix;
        } else if (prefixOrFallback) {
            this.prefix = prefixOrFallback;
        }
    }

    static async getLanguage(
        nameOrContext: NameOrContext,
        getUserLanguage: (user: User) => Promise<LocaleString>,
        getGuildLanguage: (guild: Guild) => Promise<LocaleString>
    ): Promise<string | null> {
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
            return (await getUserLanguage(user))
                ?? (interactionLocale !== defaultDiscordLocale
                    ? interactionLocale
                    : null);
        } else if (guild) {
            return (await getGuildLanguage(guild))
                ?? Translator.getLanguage((await guild.fetchOwner()).user, getUserLanguage, getGuildLanguage);
        } else {
            throw new Error("Invalid context.");
        }
    }

    /**
     * Get a translation string.
     * 
     * @param path Path of translation entry.
     * @param args Arguments for string interpolation.
     * @returns String with translation or passed path, if it was not found.
     */
    translate(path: string, ...args: FormatParameters): string {
        return this.tryTranslate(`${this.prefix}.${path}`, ...args)
            ?? this.fallback?.tryTranslate(path, ...args)
            ?? this.root?.translate(path, ...args)
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
    getTranslationFromRecord(obj: Partial<Record<LocaleString, any>>): any {
        return obj[this.localeString] ?? this.fallback?.getTranslationFromRecord(obj);
    }

    makePrefixed(prefixOrFallback: string | Translator) {
        return new Translator(this.data, prefixOrFallback, this);
    }
}
