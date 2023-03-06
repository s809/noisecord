import { Awaitable, Client } from "discord.js";
import { CommandRegistry } from "../CommandRegistry.js";
import { TranslatorManager } from "../TranslatorManager.js";
import { CommandResultError } from "./errors.js";
import { HandlerOptions } from "./HandlerOptions.js";
import { setTimeout } from "timers/promises";
import { Translator } from "../Translator.js";
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
        this.client.on(this.eventName, this.handle.bind(this));
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

    protected async executeCommand(CommandRequest: HandlerOptionsType<TConvertedOptions>, execute: () => Awaitable<string | void>, translator: Translator) {
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
                await this.options.onSlowCommand(CommandRequest);
                result = await promise;
            }
        }
        catch (e) {
            await this.options.onFailure(CommandRequest, e);
            console.error(e);
            return;
        }

        if (result === undefined) {
            await this.options.onSuccess(CommandRequest);
        } else {
            const errorPath = `errors.${result}`;
            const translatedError = translator.translate(errorPath);

            await this.options.onFailure(CommandRequest, new CommandResultError(translatedError !== errorPath
                ? translatedError
                : result));
        }
    }
}
