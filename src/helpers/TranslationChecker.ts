import { IsLiteral } from "type-fest";
import { ConditionalSimplifyDeep } from "type-fest/source/conditional-simplify.js";
import { Translator } from "../Translator.js";
import { TranslatorManager } from "../TranslatorManager.js";
import { UnionToIntersectionRecursive } from "../util.js";
import { ErrorCollector } from "./ErrorCollector.js";
import { CommandRequest } from "../handlers/CommandRequest.js";

/** @public */
export class DefaultLocalePathTranslator {
    /** @internal */
    translatorManager?: TranslatorManager;

    /** @internal */
    constructor(readonly path: string) { }
    
    getTranslation(args?: Translator.FormatParameters) {
        return this.translatorManager!.fallbackTranslator.translate(this.path, args);
    }
}

/** @public */
export class AllLocalesPathTranslator {
    /** @internal */
    translatorManager?: TranslatorManager;

    /** @internal */
    constructor(readonly path: string) { }

    getTranslation(context: TranslatorManager.ContextResolvable, args?: Translator.FormatParameters): Promise<string>;
    getTranslation(context: CommandRequest | Translator, args?: Translator.FormatParameters): string;
    getTranslation(context: TranslatorManager.ContextResolvable | CommandRequest | Translator, args?: Translator.FormatParameters) {
        if (context instanceof CommandRequest)
            return context.translator.translate(this.path, args);

        if (context instanceof Translator)
            return context.translate(this.path, args);

        return (async () => {
            const translator = await this.translatorManager!.getTranslator(context);
            return translator.translate(this.path, args);
        })();
    }
}

/** @public */
export namespace TranslationChecker {
    /** @public */
    export type PathTranslators<Input extends Record<string, boolean>> = ConditionalSimplifyDeep<UnionToIntersectionRecursive<{
        [K in keyof Input as K extends `${infer Head}.${any}` ? Head : K]:
        K extends `${string}.${infer Rest}`
        ? PathTranslators<{ [K2 in Rest]: Input[K] }>
        : K extends string
        ? IsLiteral<Input[K]> extends true
        ? Input[K] extends true
        ? AllLocalesPathTranslator
        : DefaultLocalePathTranslator
        : never
        : never;
    }>, PathTranslatorTypes>;

    /** @public */
    export type PathTranslatorTypes = DefaultLocalePathTranslator | AllLocalesPathTranslator;
}

/** @public */
export class TranslationChecker extends ErrorCollector {
    private toCheck: Record<string, boolean> = {};
    private pathTranslatorsToPrepare = new Map<string, TranslationChecker.PathTranslatorTypes[]>();

    /** @internal */
    constructor() {
        super("while checking translations");
        this.setHeader(0, "Translations");
    }

    /**
     * Converts provided object key paths into an easier to use object, and schedules them to be checked in later part of the initialization.
     * @param data - Object with keys of paths to check and values as indicators of whether to check all translators or only default.
     * @param prefix - Prefix to use.
     * @returns Converted object.
     */
    checkTranslations<Paths extends Record<string, boolean>>(data: Paths, prefix?: string): TranslationChecker.PathTranslators<Paths> {
        const result: any = {};

        for (const [key, value] of Object.entries(data)) {
            if (!key.length)
                throw new Error("Path cannot be empty.");

            const parts = key.split(".");
            let resultPart = result;

            while (parts.length > 1) {
                const part = parts.shift()!;

                if (!resultPart[part])
                    resultPart[part] = {};
                resultPart = resultPart[part];
            }

            const fullPath = prefix ? `${prefix}.${key}` : key;
            if (value) {
                resultPart[parts[0]] = new AllLocalesPathTranslator(fullPath);
                this.toCheck[fullPath] = true;
            } else {
                resultPart[parts[0]] = new DefaultLocalePathTranslator(fullPath);
                this.toCheck[fullPath] ??= false;
            }

            const list = this.pathTranslatorsToPrepare.get(fullPath);
            if (list)
                list.push(resultPart[parts[0]]);
            else
                this.pathTranslatorsToPrepare.set(fullPath, [resultPart[parts[0]]]);
        }

        return result as TranslationChecker.PathTranslators<Paths>;
    }

    /** @internal */
    runChecks(translatorManager: TranslatorManager) {
        for (const [key, value] of Object.entries(this.toCheck).sort(([name1], [name2]) => name1.localeCompare(name2))) {
            for (const pathTranslator of this.pathTranslatorsToPrepare.get(key)!)
                pathTranslator.translatorManager = translatorManager;

            if (value) {
                const missingLocales = translatorManager.rootTranslators
                    .filter(translator => !translator.tryTranslate(key))
                    .map(translator => translator.localeString);

                if (missingLocales.length)
                    this.addError(`Translation of ${key} is missing in locales: ${missingLocales.join(", ")}.`);
            } else {
                if (!translatorManager.fallbackTranslator.tryTranslate(key))
                    this.addError(`Translation of ${key} is missing in default locale (${translatorManager.fallbackLocale}).`);
            }
        }

        this.throwIfErrors();
    }
}
