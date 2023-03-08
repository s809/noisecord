import { CommandInteraction, GuildResolvable, LocaleString, Message, User } from "discord.js";
import { get } from "lodash-es";
import format from "string-format";

type FormatParameters = Parameters<typeof format>[1][];
export class Translator {
    readonly localeString: LocaleString;
    readonly setLocaleRegex: RegExp;
    readonly booleanValues: [string[], string[]];

    private data: any;
    private prefix: string | null = null;
    
    /** Translator of same locale without prefix. */
    readonly root: Translator | null = null;
    /** Translator of fallback locale with same prefix. */
    get fallback() {
        return this._fallback;
    }
    /** @internal */
    set fallback(fallback) {
        this._fallback = fallback;
    }
    private _fallback: Translator | null = null;

    /** @internal */
    constructor(data: object);
    /** @internal */
    constructor(root: Translator, prefixOrFallback: string | Translator);
    /** @internal */
    constructor(dataOrRoot: object | Translator, prefixOrFallback?: string | Translator) {
        if (dataOrRoot instanceof Translator) {
            this.data = dataOrRoot.data;
            this.root = dataOrRoot;
        } else {
            this.data = dataOrRoot;
        }
        
        const getOrThrow = (key: string) => {
            const value = get(this.data, key);
            if (!value)
                throw new Error(`${key} is missing.`);
            return value;
        }
        this.localeString = getOrThrow("locale_string")!;
        this.setLocaleRegex = new RegExp(`^${getOrThrow("set_locale_regex")}$`, "iu");
        this.booleanValues = getOrThrow("boolean_values");

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
}
