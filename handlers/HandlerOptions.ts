import { Awaitable } from "discord.js";
import { CommandRequest } from "../messageTypes/CommandRequest.js";

export interface HandlerOptions<TCommandRequest = CommandRequest> {
    slowCommandDelayMs?: number;
    /**
     * Called if the command did not complete before a specified delay (default is 1000ms). \
     * Overrides default behavior of reacting with a "spinning circle" emoji (only for messages).
     */
    onSlowCommand?: (msg: TCommandRequest) => Awaitable<void>;
    /**
     * Called if the command returned `undefined`. \
     * Overrides default behavior of replying with "OK" (for interaction commands) or reacting with a "white tick mark" emoji (for message commands).
     */
    onSuccess?: (msg: TCommandRequest) => Awaitable<void>;
    /**
     * Called if the command returned a value other than `undefined` or threw an exception. \
     * Overrides default behavior of replying with an error and reacting with a "red cross" emoji (only for messages).
     */
    onFailure?: (msg: TCommandRequest, error: Error) => Awaitable<void>;
}
