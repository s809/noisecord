import { Awaitable } from "discord.js";
import { CommandRequest } from "../messageTypes/CommandRequest.js";

/** @public */
export interface _HandlerOptions<TCommandRequest = CommandRequest> {
    slowCommandDelayMs?: number;
    /**
     * Called if the command did not complete before a specified delay (default is 1000ms).
 *
     * Overrides default behavior of reacting with a "spinning circle" emoji (only for messages).
     */
    onSlowCommand?: (req: TCommandRequest) => Awaitable<void>;
    /**
     * Called if the command returned `undefined`.
 *
     * Overrides default behavior of replying with "OK" (for interaction commands) or reacting with a "white tick mark" emoji (for message commands).
     */
    onSuccess?: (req: TCommandRequest) => Awaitable<void>;
    /**
     * Called if the command returned a value other than `undefined` or threw an exception.
 *
     * Overrides default behavior of replying with an error and reacting with a "red cross" emoji (only for messages).
     */
    onFailure?: (req: TCommandRequest, error: Error) => Awaitable<void>;
}
