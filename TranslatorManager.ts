import { Guild, LocaleString, User } from "discord.js";
import { readdir, readFile } from "fs/promises";
import path from "path";
import { NameOrContext, Translator } from "./Translator";

export interface TranslatorManagerOptions {
    translationFileDirectory: string;
    defaultLocale: LocaleString;
    getUserLanguage: (user: User) => Promise<LocaleString>;
    getGuildLanguage: (guild: Guild) => Promise<LocaleString>;
}

export class TranslatorManager {
    private translators = new Map<LocaleString, Map<string | null, Translator>>();
    
    public get fallbackTranslator(): Translator {
        if (!this._fallbackTranslator)
            throw new Error(`${this.init.name}() was not called before use of ${this.constructor.name} instance.`);
        return this._fallbackTranslator;
    }
    private _fallbackTranslator?: Translator | undefined;

    constructor(private options: TranslatorManagerOptions) {}

    async init() {
        for (let file of await readdir(this.options.translationFileDirectory)) {
            const data = JSON.parse(await readFile(path.join(this.options.translationFileDirectory, file), "utf8"));
            const translator = new Translator(data);

            this.translators.set(translator.localeString, new Map([
                [null, translator]
            ]));
        }

        if (!this.translators.has(this.options.defaultLocale))
            throw new Error("No matching localization file found for default locale.");
        this._fallbackTranslator = this.translators.get(this.options.defaultLocale)?.get(null)!;

        return this;
    }

    async getTranslator(nameOrContext: NameOrContext, prefix?: string) {
        const language = (await Translator.getLanguage(nameOrContext, this.options.getUserLanguage, this.options.getGuildLanguage)) ?? this.options.defaultLocale;

        let usingFallback = false;
        const translatorsInLocale = this.translators.get(language as LocaleString)
            ?? (usingFallback = true, this.translators.get(this.options.defaultLocale)!);

        let translator = translatorsInLocale.get(prefix ?? null);
        if (!translator && prefix) {
            translator = translatorsInLocale.get(null)!.makePrefixed(usingFallback
                ? prefix
                : await this.getTranslator(this.options.defaultLocale, prefix));
            
            translatorsInLocale.set(prefix, translator);
        }

        return translator!;
    }

    getLocalizations(translationPath: string) {
        return Object.fromEntries([...this.translators.values()]
            .map(map => map.get(null)!)
            .map(translator => [translator.localeString, translator.tryTranslate(translationPath)] as const)
            .filter(([, translation]) => translation !== null)) as Partial<Record<LocaleString, string>>;
    }
}
