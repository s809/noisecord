import { CommandInteraction, GuildResolvable, LocaleString, Message, User } from "discord.js";
import { get } from "lodash-es";
import format from "string-format";

type FormatParameters = Parameters<typeof format>[1][];
export class Translator {
    readonly localeString: LocaleString;
    readonly setLanguageRegex: RegExp;
    readonly booleanValues: [string[], string[]];

    private data: any;
    private prefix: string | null = null;
    
    /** Translator of same locale without prefix. */
    readonly root: Translator | null = null;
    /** Translator of fallback locale with same prefix. */
    readonly fallback: Translator | null = null;

    constructor(data: object);
    constructor(root: Translator, prefix: string);
    constructor(root: Translator, fallback: Translator);
    constructor(root: Translator, prefixOrFallback: string | Translator);
    constructor(dataOrRoot: object | Translator, prefixOrFallback?: string | Translator) {
        if (dataOrRoot instanceof Translator) {
            this.data = dataOrRoot.data;
            this.root = dataOrRoot;
        } else {
            this.data = dataOrRoot;
        }
        
        this.localeString = get(this.data, "locale_string")!;
        this.setLanguageRegex = new RegExp(`^${get(this.data, "set_language_regex")}$`, "iu");
        this.booleanValues = get(this.data, "boolean_values");

        if (prefixOrFallback instanceof Translator) {
            this.prefix = prefixOrFallback.prefix;
            this.fallback = prefixOrFallback;
        } else if (prefixOrFallback) {
            this.prefix = prefixOrFallback;
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
        return new Translator(this.root ?? this, prefixOrFallback);
    }
}
