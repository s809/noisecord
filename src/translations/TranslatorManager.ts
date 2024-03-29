import { CommandInteraction, Guild, GuildResolvable, LocaleString, Message, User } from "discord.js";
import { readdir, readFile } from "fs/promises";
import path from "path";
import { ErrorCollector } from "../helpers/ErrorCollector.js";
import { Translator } from "./Translator.js";
import { _getValueOrThrowInitError } from "../util.js";
import defaultTranslations from "./defaultTranslations.js";
import { merge } from "lodash-es";

/** @public */
export interface TranslatorManagerOptions {
    translationFileDirectory?: string;
    defaultLocale?: LocaleString;
    useBuiltInFallback?: boolean;
    getUserLocale?: (user: User) => Promise<LocaleString | null>;
    getGuildLocale?: (guild: Guild) => Promise<LocaleString | null>;
}

/** @public */
export namespace TranslatorManager {
    /** @public */
    export type ContextResolvable = string | Message | CommandInteraction | GuildResolvable | User;
}

/** @public */
export class TranslatorManager {
    static readonly defaultDiscordLocale: LocaleString = "en-US";

    private translators = new Map<LocaleString, Map<string | null, Translator>>();
    
    readonly setLocaleRegexes = {} as Record<LocaleString, RegExp>;
    readonly rootTranslators: Translator[] = [];

    public get fallbackLocale() {
        return this.fallbackTranslator.localeString;
    }
    public get fallbackTranslator(): Translator {
        return _getValueOrThrowInitError(this._fallbackTranslator, this);
    }
    private _fallbackTranslator?: Translator;

    constructor(private options: TranslatorManagerOptions = {}) { }

    /** @internal */
    async init() {
        const errorCollector = new ErrorCollector("while initializing translators");

        this.options.defaultLocale ??= TranslatorManager.defaultDiscordLocale;
        this.options.useBuiltInFallback ??= true;
        const defaultTranslationsCopy = Object.assign(structuredClone(defaultTranslations), { 
            locale_string: this.options.defaultLocale 
        });

        const files = this.options.translationFileDirectory
            ? (await readdir(this.options.translationFileDirectory)).filter(file => file.endsWith(".json"))
            : [];

        if (files.length) {
            for (const file of files) {
                errorCollector.setHeader(0, `File: ${file}`);

                try {
                    let data = JSON.parse(await readFile(path.join(this.options.translationFileDirectory!, file), "utf8"));
                    if (this.options.useBuiltInFallback && data.locale_string === this.options.defaultLocale)
                        data = merge(defaultTranslationsCopy, data);

                    const translator = new Translator(data, errorCollector);

                    this.translators.set(translator.localeString, new Map([
                        [null, translator]
                    ]));
                    this.rootTranslators.push(translator);
                    this.setLocaleRegexes[translator.localeString] = translator.setLocaleRegex;
                } catch (e: unknown) {
                    if (!(e instanceof Error))
                        e = new Error(`${e}`);
                    (e as Error).message += `\nFile: ${file}`;
                    throw e;
                }
            }
        } else if (this.options.useBuiltInFallback) {
            const translator = new Translator(Object.assign(defaultTranslationsCopy), errorCollector);

            this.translators.set(translator.localeString, new Map([
                [null, translator]
            ]));
            this.rootTranslators.push(translator);
            this.setLocaleRegexes[translator.localeString] = translator.setLocaleRegex;
        }

        if (!this.translators.has(this.options.defaultLocale)) {
            errorCollector.setHeader(0, "Default locale");
            errorCollector.addError("No matching localization file found for default locale.");
        }
        this._fallbackTranslator = this.translators.get(this.options.defaultLocale)?.get(null)!;

        for (const map of this.translators.values()) {
            const translator = map.get(null)!;
            if (translator.localeString === this.fallbackLocale)
                continue;
            
            translator.setFallback(this.fallbackTranslator);
        }

        errorCollector.throwIfErrors();

        return this;
    }

    async getLocale(nameOrContext: TranslatorManager.ContextResolvable): Promise<string | null> {
        if (typeof nameOrContext === "string") return nameOrContext;

        /*
        if should use guild:
            use guild's locale ?? owner's locale
        if shoule use user:
            if overridden:
                use override
            else:
                if provided == default discord:
                    use default bot // need of use provided == default solved by override
                else:
                    use provided ?? default bot
        */

        let user: User | undefined;
        let interactionLocale: LocaleString = TranslatorManager.defaultDiscordLocale;
        let guild: Guild | null | undefined;

        if (nameOrContext instanceof CommandInteraction) {
            if (nameOrContext.guild && !(nameOrContext.ephemeral ?? true)) {
                guild = nameOrContext.guild;
            } else {
                user = nameOrContext.user;
                interactionLocale = nameOrContext.locale;
            }
        } else if (nameOrContext instanceof Guild) {
            guild = nameOrContext;
        } else if (nameOrContext instanceof User) {
            user = nameOrContext;
        } else if (nameOrContext instanceof Message && nameOrContext.channel.isDMBased()) {
            user = nameOrContext.author;
        } else if (nameOrContext.guild) {
            guild = nameOrContext.guild as Guild;
        }

        if (user) {
            return await this.options.getUserLocale?.(user)
                ?? (interactionLocale !== TranslatorManager.defaultDiscordLocale
                    ? interactionLocale
                    : null);
        } else if (guild) {
            return await this.options.getGuildLocale?.(guild)
                ?? this.getLocale((await guild.fetchOwner()).user);
        } else {
            throw new Error("Invalid context.");
        }
    }

    async getTranslator(nameOrContext: TranslatorManager.ContextResolvable, prefix?: string): Promise<Translator> {
        const locale = (await this.getLocale(nameOrContext)) ?? this.fallbackLocale;

        const translatorsInLocale = this.translators.get(locale as LocaleString);
        if (!translatorsInLocale)
            return this.getTranslator(this.fallbackLocale, prefix);
        
        let translator = translatorsInLocale.get(prefix ?? null);
        if (!translator) {
            // prefix always exists at this point since translatorsInLocale && !translator
            // (at least null is always present)
            translator = new Translator(translatorsInLocale.get(null)!, locale === this.fallbackLocale
                ? prefix!
                : await this.getTranslator(this.fallbackLocale, prefix));
            translatorsInLocale.set(prefix!, translator);
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
