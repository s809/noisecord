import { ConditionalSimplifyDeep } from "type-fest/source/conditional-simplify.js";
import { Translator } from "../translations/Translator.js";
import { TranslatorManager } from "../translations/TranslatorManager.js";
import { DeeplyNestedObject } from "../util.js";
import { ErrorCollector } from "../helpers/ErrorCollector.js";
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
    export type PathTranslators<Input extends DeeplyNestedObject<boolean>> = ConditionalSimplifyDeep<{
        [K in keyof Input]: K extends `${string}.${string}`
            ? never
            : Input[K] extends boolean
                ? Input[K] extends true
                    ? AllLocalesPathTranslator
                    : DefaultLocalePathTranslator
                : PathTranslators<Exclude<Input[K], boolean>>;
    }, PathTranslatorTypes>;

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
    checkTranslations<Paths extends DeeplyNestedObject<boolean>>(data: Paths, prefix?: string): TranslationChecker.PathTranslators<Paths> {
        const entries = Object.entries(data).map(([key, value]) => {
            if (!key.length)
                throw new Error("Path cannot be empty.");
            if (key.includes("."))
                throw new Error(`Translation path keys cannot include dots: ${key}`);

            const fullPath = prefix ? `${prefix}.${key}` : key;
            if (typeof value === "object")
                return [key, this.checkTranslations(value, fullPath)];

            let newValue;
            if (value) {
                newValue = new AllLocalesPathTranslator(fullPath);
                this.toCheck[fullPath] = true;
            } else {
                newValue = new DefaultLocalePathTranslator(fullPath);
                this.toCheck[fullPath] ??= false;
            }

            const list = this.pathTranslatorsToPrepare.get(fullPath);
            if (list)
                list.push(newValue);
            else
                this.pathTranslatorsToPrepare.set(fullPath, [newValue]);

            return [key, newValue] as const;
        });

        return Object.fromEntries(entries) as TranslationChecker.PathTranslators<Paths>;
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
