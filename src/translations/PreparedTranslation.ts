import { Translator } from "./Translator.js";

/** @public */
export type Translatable<T extends string | object> = T extends string
    ? string | PreparedTranslation
    : {
        [K in keyof T]: T[K] extends string | object
            ? Translatable<T[K]>
            : T[K];
    };

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
