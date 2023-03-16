import { LocaleString } from "discord.js";
import { get } from "lodash-es";
import format from "string-format";
import { ErrorCollector } from "./index.js";

/** @public */
export type FormatParameters = Parameters<typeof format>[1][];

/** 
 * Provides functions for translating text to a specific locale.
 * @public
 */
export class Translator {
    /**
     * Contains locale to which everything will be translated to
     */
    readonly localeString: LocaleString;
    /**
     * RegExp for setting locale of specified locale
     */
    readonly setLocaleRegex: RegExp;
    /** 
     * Array of arrays of translations of boolean values.
     * Index 0 - negative values (e.g. "false"),
     * index 1 - positive values (e.g. "true").
     */
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
    setFallback(fallback: Translator) {
        this._fallback = fallback;
    }
    private _fallback: Translator | null = null;

    /** @internal */
    constructor(data: object, errorCollector: ErrorCollector);
    /** @internal */
    constructor(root: Translator, prefixOrFallback: string | Translator);
    /** @internal */
    constructor(dataOrRoot: object | Translator, param2?: string | Translator | ErrorCollector) {
        if (dataOrRoot instanceof Translator) {
            this.data = dataOrRoot.data;
            this.root = dataOrRoot;
        } else {
            this.data = dataOrRoot;
        }
        
        const getOrError = (key: string) => {
            const value = get(this.data, key);
            if (!value) {
                if (param2 instanceof ErrorCollector)
                    param2.addError(`${key} is missing.`);
                else
                    throw new Error(`${key} is missing.`);
            }
            return value;
        }
        this.localeString = getOrError("locale_string")!;
        this.setLocaleRegex = new RegExp(`^${getOrError("set_locale_regex")}$`, "iu");
        this.booleanValues = getOrError("boolean_values");

        if (param2 instanceof Translator) {
            this.prefix = param2.prefix;
            this._fallback = param2;
        } else if (typeof param2 === "string") {
            this.prefix = param2;
        }
    }

    /**
     * Get a translation string.
     * 
     * @param path - Path of translation entry.
     * @param args - Arguments for string interpolation.
     * @returns String with translation or passed path, if it was not found.
     */
    translate(path: string, ...args: FormatParameters): string {
        const prefixedPath = this.prefix
            ? `${this.prefix}.${path}`
            : path;

        return this.tryTranslate(prefixedPath, ...args)
            ?? this.fallback?.tryTranslate(prefixedPath, ...args)
            ?? this.root?.translate(path, ...args)
            ?? path;
    }

    /**
     * Get a translation string.
     * 
     * @param path - Path of translation entry.
     * @param args - Arguments for string interpolation.
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
     * @param obj - Object to get value from.
     * @returns Value from object or undefined.
     */
    getTranslationFromRecord(obj: Partial<Record<LocaleString, any>>): any {
        return obj[this.localeString] ?? this.fallback?.getTranslationFromRecord(obj);
    }
}
