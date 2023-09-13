import { Awaitable, Client, ClientEvents } from "discord.js";
import { CommandRegistry } from "../CommandRegistry.js";
import { TranslatorManager } from "../translations/TranslatorManager.js";
import { CommandResultError } from "./errors/CommandResultError.js";
import { EventHandlerOptions } from "./EventHandlerOptions.js";
import { setTimeout } from "timers/promises";
import { Translator } from "../translations/Translator.js";
import { Merge } from "type-fest";
import { Command } from "../interfaces/Command.js";
import { CommandRequest } from "./CommandRequest.js";
import { PreparedTranslation } from "../translations/PreparedTranslation.js";
import { set } from "lodash-es";

/** @public */
export namespace EventHandler {

    /** @public */
    export type HandlerOptionsCommandRequest<T> = T extends EventHandlerOptions<infer T> ? T : never;

    /**
     * Applies T from any inherited/modified `*Options` to a clean {@link EventHandlerOptions} type.
     * @public
     */
    export type CleanHandlerOptions<T> = EventHandlerOptions<HandlerOptionsCommandRequest<T>>;

    /** @public */
    export type CommonHandlerOptions = EventHandler["defaultCommonStatusHandlers"];
}

/** @public */
export abstract class EventHandler<Options extends EventHandlerOptions = EventHandlerOptions, EventName extends keyof ClientEvents = keyof ClientEvents> {
    protected readonly translatorManager: TranslatorManager;
    protected readonly options: Required<Options>;
    readonly defaultStatusHandlers: EventHandler.CleanHandlerOptions<Options>;
    readonly defaultCommonStatusHandlers = {
        slowCommandDelayMs: 1000,
        async onInvalidArguments(req, command, e, translator) {
            await req.replyOrEdit(translator.translate(`errors.${e.message}`, e.cause) + "\n"
                + translator.translate("strings.command_usage", { usage: this.commandRegistry.getCommandUsageString(command, req.prefix, req.translator) }));
        },
        async onConditionsUnsatisfied(req, key, translator) {
            await req.replyOrEdit(translator.translate(`condition_errors.${key}`));
        },
    } satisfies Partial<EventHandler.CleanHandlerOptions<Options>>;

    protected constructor(
        protected readonly client: Client,
        protected readonly eventName: EventName,
        protected readonly commandRegistry: CommandRegistry,
        options: Merge<Required<Options>, Partial<EventHandler.CleanHandlerOptions<Options>>>,
        defaultStatusHandlers: Merge<EventHandler.CleanHandlerOptions<Options>, Partial<EventHandler.CommonHandlerOptions>>
    ) {
        this.translatorManager = commandRegistry.translatorManager;
        this.defaultStatusHandlers = {
            ...this.defaultCommonStatusHandlers,
            ...defaultStatusHandlers
        };
        this.options = {
            ...this.defaultStatusHandlers,
            ...options
        } as any;

        this.client.on(eventName, this.handle.bind(this));
    }

    protected abstract handle(...args: ClientEvents[EventName]): Promise<void>;

    protected splitByWhitespace(str: string) {
        return str.match(/[^"\s]+|"(?:\\"|[^"])+"/g)?.map(part => {
            if (part.match(/^".*"$/))
                part = part.slice(1, -1);

            return part.replace("\\\"", "\"").replace("\\\\", "\\");
        }) ?? [];
    }

    protected prepareTranslationObject(command: Command, translator: Translator) {
        if (!command.translations)
            return undefined;

        const translationObject: Command.PreparedTranslators<any> = {};

        for (const key of command.translations)
            set(translationObject, key, new PreparedTranslation(translator, `${command.translationPath}.${key}`));

        return translationObject;
    }

    protected async replyConditionsUnsatisfied(commandRequest: CommandRequest, key: string, translator: Translator) {
        await this.options.onConditionsUnsatisfied.call(this, commandRequest, key, translator);
    }

    protected async replyInvalidArguments(commandRequest: CommandRequest, command: Command, e: Error, translator: Translator) {
        await this.options.onInvalidArguments.call(this, commandRequest, command, e, translator);
    }

    protected async executeCommand(commandRequest: EventHandler.HandlerOptionsCommandRequest<Options>, execute: () => Awaitable<string | PreparedTranslation | void>, translator: Translator) {
        let result: Awaited<ReturnType<typeof execute>>;
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
                await this.options.onSlowCommand.call(this, commandRequest);
                result = await promise;
            }
        }
        catch (e) {
            await this.options.onFailure.call(this, commandRequest, e);
            console.error(e);
            return;
        }

        if (result === undefined) {
            await this.options.onSuccess.call(this, commandRequest);
            return;
        }

        if (result instanceof PreparedTranslation) {
            await this.options.onFailure.call(this, commandRequest, new CommandResultError(result.translate()));
        } else {
            const errorPath = `errors.${result}`;
            const translatedError = translator.translate(errorPath);

            await this.options.onFailure.call(this, commandRequest, new CommandResultError(translatedError !== errorPath
                ? translatedError
                : result));
        }
    }
}
