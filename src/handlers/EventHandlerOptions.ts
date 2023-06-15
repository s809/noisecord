import { Awaitable } from "discord.js";
import { ArgumentParseError } from "./errors/ArgumentParseError.js";
import { CommandRequest } from "./CommandRequest.js";
import { EventHandler } from "./EventHandler.js";
import { Command } from "../interfaces/Command.js";
import { Translator } from "../Translator.js";

/** @public */
export interface EventHandlerOptions<TCommandRequest = CommandRequest> {
    slowCommandDelayMs: number;
    
    /**
     * Called if the command did not complete before a specified delay (default is 1000ms).
     */
    onSlowCommand: (this: EventHandler, req: TCommandRequest) => Awaitable<void>;
    
    /**
     * Called if the command returned `undefined`.
     */
    onSuccess: (this: EventHandler, req: TCommandRequest) => Awaitable<void>;

    /**
     * Called if the command returned a value other than `undefined` or threw an exception.
     */
    onFailure: (this: EventHandler, req: TCommandRequest, error: Error) => Awaitable<void>;

    /**
     * Called if the command received invalid arguments.
     */
    onInvalidArguments: (this: EventHandler, req: TCommandRequest, command: Command, e: ArgumentParseError<any>, translator: Translator) => Awaitable<void>;

    /**
     * Called if the command was attempted to run and conditions were not satisfied.
     */
    onConditionsUnsatisfied: (this: EventHandler, req: TCommandRequest, key: string, translator: Translator) => Awaitable<void>;
}
