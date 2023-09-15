import mapObject from "map-obj";
import { Translator } from "./Translator.js";

/** @public */
export namespace PreparedTranslation {
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
}

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

    /**
     * Translate a translatable value.
     *
     * @remarks
     * Translates the provided translatable value, which can be a string, an object with translatable properties,
     * or a PreparedTranslation instance.
     *
     * @param translatable - The translatable value to translate.
     * @returns The translated value.
     */
    static translate<T extends string | object>(translatable: PreparedTranslation.Translatable<T>): T {
        if (typeof translatable === "string")
            return translatable as T;

        if (translatable instanceof PreparedTranslation)
            return translatable.translate() as T;

        return mapObject(
            translatable,
            (k, v) => [
                k,
                v instanceof PreparedTranslation ? v.translate() : v,
                {
                    // Recurse only if array or anonymous object
                    shouldRecurse: [Object, Array].includes(v?.constructor)
                }
            ],
            { deep: true }
        ) as T;
    }
}

