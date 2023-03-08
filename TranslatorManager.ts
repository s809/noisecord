import { CommandInteraction, Guild, GuildResolvable, LocaleString, LocalizationMap, Message, User } from "discord.js";
import { readdir, readFile } from "fs/promises";
import path from "path";
import { Translator } from "./Translator.js";

const defaultDiscordLocale: LocaleString = "en-US";

export interface TranslatorManagerOptions {
    translationFileDirectory: string;
    defaultLocale: LocaleString;
    getUserLocale: (user: User) => Promise<LocaleString | null>;
    getGuildLocale: (guild: Guild) => Promise<LocaleString | null>;
}

export type NameOrContext = string | Message | CommandInteraction | GuildResolvable | User;
export class TranslatorManager {
    private translators = new Map<LocaleString, Map<string | null, Translator>>();
    
    readonly setLocaleRegexes = {} as Record<LocaleString, RegExp>;

    public get fallbackLocale() {
        return this.fallbackTranslator.localeString;
    }
    public get fallbackTranslator(): Translator {
        if (!this._fallbackTranslator)
            throw new Error(`${this.init.name}() was not called before use of ${this.constructor.name} instance.`);
        return this._fallbackTranslator;
    }
    private _fallbackTranslator?: Translator | undefined;

    constructor(private options: TranslatorManagerOptions) {}

    async init() {
        for (let file of await readdir(this.options.translationFileDirectory)) {
            try {
                const data = JSON.parse(await readFile(path.join(this.options.translationFileDirectory, file), "utf8"));
                const translator = new Translator(data);

                this.translators.set(translator.localeString, new Map([
                    [null, translator]
                ]));
                this.setLocaleRegexes[translator.localeString] = translator.setLocaleRegex;
            } catch (e: unknown) {
                if (!(e instanceof Error))
                    e = new Error(`${e}`);
                (e as Error).message += `\nFile: ${file}`;
                throw e;
            }
        }

        if (!this.translators.has(this.options.defaultLocale))
            throw new Error("No matching localization file found for default locale.");
        this._fallbackTranslator = this.translators.get(this.options.defaultLocale)?.get(null)!;

        for (const map of this.translators.values()) {
            const translator = map.get(null)!;
            if (translator.localeString === this.fallbackLocale)
                continue;
            
            translator.fallback = this.fallbackTranslator;
        }

        return this;
    }

    async getLocale(nameOrContext: NameOrContext): Promise<string | null> {
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
        let interactionLocale: LocaleString = defaultDiscordLocale;
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
            return await this.options.getUserLocale(user)
                ?? (interactionLocale !== defaultDiscordLocale
                    ? interactionLocale
                    : null);
        } else if (guild) {
            return await this.options.getGuildLocale(guild)
                ?? this.getLocale((await guild.fetchOwner()).user);
        } else {
            throw new Error("Invalid context.");
        }
    }

    async getTranslator(nameOrContext: NameOrContext, prefix?: string): Promise<Translator> {
        const locale = (await this.getLocale(nameOrContext)) ?? this.options.defaultLocale;

        let usingFallback = false;
        const translatorsInLocale = this.translators.get(locale as LocaleString)
            ?? (usingFallback = true, this.translators.get(this.options.defaultLocale)!);

        let translator = translatorsInLocale.get(prefix ?? null);
        if (!translator && prefix) {
            translator = new Translator(translatorsInLocale.get(null)!, usingFallback
                ? await this.getTranslator(this.options.defaultLocale, prefix)
                : prefix);
            
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
