import mapObject from "map-obj";
import { PreparedTranslation } from "./PreparedTranslation.js";

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
    export type Value<T, TExcluded = never> = T extends string ? string | PreparedTranslation : T extends TExcluded ? T : T extends object ? {
        [K in keyof T]: Value<T[K], T>;
    } : T;

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
    export function translateValue<T>(value: Value<T>): T {
        function translateIfPossible(value: any): any {
            if (value instanceof PreparedTranslation)
                return value.translate();

            if (Array.isArray(value))
                return value.map(x => translateIfPossible(x));

            if (typeof value === "object" && value.constructor === Object) {
                return mapObject(
                    value,
                    (k, v) => [k as string, translateIfPossible(v), { shouldRecurse: v?.constructor === Object }],
                    { deep: true }
                )
            }

            return value;
        }

        return translateIfPossible(value);
    }
}
