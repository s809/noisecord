import { Awaitable, Client, ClientEvents } from "discord.js";
import { CommandRegistry } from "../CommandRegistry.js";
import { TranslatorManager } from "../TranslatorManager.js";
import { CommandResultError } from "./errors.js";
import { _HandlerOptions } from "./HandlerOptions.js";
import { setTimeout } from "timers/promises";
import { Translator } from "../Translator.js";
import { merge } from "lodash-es";

/** @internal */
export type _HandlerOptionsType<T> = T extends _HandlerOptions<infer T> ? T : never;

/** @internal */
export type _TypedHandlerOptions<T> = _HandlerOptions<_HandlerOptionsType<T>>;

/** @internal */
export abstract class _EventHandler<TConvertedOptions extends Required<_HandlerOptions>, EventName extends keyof ClientEvents> {
    protected abstract readonly eventName: EventName;

    protected readonly translatorManager: TranslatorManager;
    protected readonly options: TConvertedOptions;

    protected constructor(
        protected readonly client: Client,
        protected readonly commandRegistry: CommandRegistry,
        options: Omit<TConvertedOptions, keyof Required<_HandlerOptions>> & _TypedHandlerOptions<TConvertedOptions>,
        readonly defaultStatusHandlers: Omit<Required<_TypedHandlerOptions<TConvertedOptions>>, "slowCommandDelayMs">
    ) {
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

    protected abstract handle(...args: ClientEvents[EventName]): Promise<void>;

    protected splitByWhitespace(str: string) {
        return str.match(/[^"\s]+|"(?:\\"|[^"])+"/g)?.map(part => {
            if (part.match(/^".*"$/))
                part = part.slice(1, -1);

            return part.replace("\\\"", "\"").replace("\\\\", "\\");
        }) ?? [];
    }

    protected async executeCommand(CommandRequest: _HandlerOptionsType<TConvertedOptions>, execute: () => Awaitable<string | void>, translator: Translator) {
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
