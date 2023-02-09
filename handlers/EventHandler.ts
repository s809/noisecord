import { Awaitable, Client } from "discord.js";
import { CommandRegistry } from "../CommandRegistry";
import { TranslatorManager } from "../TranslatorManager";
import { CommandResultError } from "./errors";
import { HandlerOptions } from "./HandlerOptions";
import { setTimeout } from "timers/promises";
import { Translator } from "../Translator";
import { merge } from "lodash-es";

type HandlerOptionsType<T> = T extends HandlerOptions<infer T> ? T : never;

type TypedHandlerOptions<T> = HandlerOptions<HandlerOptionsType<T>>;

export abstract class EventHandler<Args extends any[], TConvertedOptions extends Required<HandlerOptions>> {
    protected abstract readonly eventName: string;

    protected readonly translatorManager: TranslatorManager;
    protected readonly options: TConvertedOptions;

    protected constructor(
        protected readonly client: Client,
        protected readonly commandRegistry: CommandRegistry,
        options: Omit<TConvertedOptions, keyof Required<HandlerOptions>> & TypedHandlerOptions<TConvertedOptions>,
        readonly defaultStatusHandlers: Omit<Required<TypedHandlerOptions<TConvertedOptions>>, "slowCommandDelayMs">) {
        this.translatorManager = commandRegistry.translatorManager;
        this.options = {
            slowCommandDelayMs: 1000,
            ...merge(defaultStatusHandlers, options)
        } as TConvertedOptions;
    }

    async init() {
        this.client.on(this.eventName, this.handle);
        return this;
    }

    protected abstract handle(...args: Args): Promise<void>;

    protected splitByWhitespace(str: string) {
        return str.match(/[^"\s]+|"(?:\\"|[^"])+"/g)?.map(part => {
            if (part.match(/^".*"$/))
                part = part.slice(1, -1);

            return part.replace("\\\"", "\"").replace("\\\\", "\\");
        }) ?? [];
    }

    protected async executeCommand(commandMessage: HandlerOptionsType<TConvertedOptions>, execute: () => Awaitable<string | void>, translator: Translator) {
        let result: string | undefined;
        try {
            let finished = false;

            const promise = Promise.resolve(execute()).then((result: any) => {
                finished = true;
                return result;
            });

            result = await Promise.race([
                promise,
                setTimeout(this.options.slowCommandDelayMs)
            ]);

            if (!finished) {
                await this.options.onSlowCommand(commandMessage);
                result = await promise;
            }
        }
        catch (e) {
            await this.options.onFailure(commandMessage, e);
        }

        if (result === undefined) {
            await this.options.onSuccess(commandMessage);
        } else {
            const errorPath = `errors.${result}`;
            const translatedError = translator.translate(errorPath);

            await this.options.onFailure(commandMessage, new CommandResultError(translatedError !== errorPath
                ? translatedError
                : result));
        }
    }
}