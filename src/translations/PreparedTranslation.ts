import { Translator } from "./Translator.js";

/**
 * Represents a translatable type.
 *
 * @remarks
 * This type allows for the translation of strings or objects with translatable properties.
 * Strings will be translated directly, while objects will have their properties translated recursively.
 *
 * @public
 * @typeparam T - The type of the value to translate.
 * @typeparam TExcluded - A type to exclude from translation (avoids infinite recursion).
 */
export type Translatable<T, TExcluded = never> = T extends string
    ? string | PreparedTranslation
    : T extends TExcluded
        ? T
        : T extends object
            ? {
                [K in keyof T]: Translatable<T[K], T>;
            }
            : T;

/**
 * Represents context-specific translator, for a specific translation path.
 *
 * @public
 */
export class PreparedTranslation {
    /** @internal */
    constructor(
        private translator: Translator,
        private path: string,
        private args?: Translator.FormatParameters
    ) { }

    /**
     * Create a new PreparedTranslator instance with updated format parameters.
     *
     * @param args - The updated format parameters.
     * @returns A new PreparedTranslator instance with the specified format parameters.
     */
    withArgs(args: Translator.FormatParameters) {
        return new PreparedTranslation(this.translator, this.path, args);
    }

    /**
     * Translates the prepared text using the provided Translator instance.
     *
     * @returns The translated text.
     */
    translate() {
        return this.translator.translate(this.path, this.args);
    }
}

