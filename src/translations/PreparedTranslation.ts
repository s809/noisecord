import { Translatable } from "./Translatable.js";
import { Translator } from "./Translator.js";

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
    withArgs(args: Translatable.Value<Translator.FormatParameters>) {
        return new PreparedTranslation(this.translator, this.path, Translatable.translateValue<Translator.FormatParameters>(args));
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
