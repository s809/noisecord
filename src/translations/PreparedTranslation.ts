import mapObject from "map-obj";
import { Translator } from "./Translator.js";

/** @public */
export namespace Translatable {
    /**
     * Represents a translatable value.
     *
     * @remarks
     * This type allows for the translation of strings or objects with translatable properties.
     * Strings will be translated directly, while objects will have their properties translated recursively.
     *
     * @public
     * @typeparam T - The type of the value to translate.
     * @typeparam TExcluded - A type to exclude from translation (avoids infinite recursion).
     */
    export type Value<T, TExcluded = never> = T extends string
        ? string | PreparedTranslation
        : T extends TExcluded
            ? T
            : T extends object
                ? {
                    [K in keyof T]: Value<T[K], T>;
                }
                : T;

    /**
     * Translate a translatable value.
     *
     * @remarks
     * Translates the provided translatable value, which can be a string, an object with translatable properties,
     * or a PreparedTranslation instance.
     *
     * @param value - The translatable value to translate.
     * @returns The translated value.
     */
    export function translateValue<T extends string | object>(value: Value<T>): T {
        if (typeof value === "string")
            return value as T;

        if (value instanceof PreparedTranslation)
            return value.translate() as T;

        return mapObject(
            value,
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
