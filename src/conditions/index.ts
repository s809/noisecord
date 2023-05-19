import { Message } from "discord.js";
import { CommandRequest } from "../handlers/CommandRequest.js";
import { Command } from "../definitions.js";

/** @public */
export interface CommandCondition {
    name: string;
    check: (context: CommandContextResolvable) => boolean;
    failureMessage: string;
    hideInDescription?: boolean;
    hideCommand?: boolean | ((context: CommandContextResolvable) => boolean);
    satisfiedBy?: CommandCondition | CommandCondition[];
    requires?: CommandCondition | CommandCondition[];
}

/** @public */
export type CommandContextResolvable = Message | CommandRequest;

/**
 * Checks a provided command condition against a message.
 * 
 * `allowed` is true if the condition is (at least one of):
 * - overridable and {@link override} is true
 * - satisfied with and its subconditions are satisfied
 * - satisfied by any of alternatives
 */
function checkCondition(
    context: CommandContextResolvable,
    condition: CommandCondition
): string | null {
    if (condition.requires) {
        const requires = Array.isArray(condition.requires)
            ? condition.requires
            : [condition.requires];
        const result = checkConditions(context, requires);
        if (!result)
            return result;
    }

    const allowed = condition.check(context);
    if (allowed)
        return null;

    if (condition.satisfiedBy) {
        const satisfiedBy = Array.isArray(condition.satisfiedBy)
            ? condition.satisfiedBy
            : [condition.satisfiedBy];
        const result = satisfiedBy.some(condition => !checkCondition(context, condition));
        if (result)
            return null;
    }

    return condition.failureMessage;
}

/**
 * Checks the provided list of conditions against a message.
 * 
 * `allowed` is true if all conditions are satisfied.
 *
 * `message` is the message of the first failed condition if all failed conditions have messages, otherwise undefined.
 * 
 * @see checkCondition
 * @public
 */
export function checkConditions(context: CommandContextResolvable, conditions: CommandCondition[]): string | null;

/**
 * Checks the command's list of conditions against a message.
 * 
 * `allowed` is true if all conditions are satisfied.
 *
 * `message` is the message of the first failed condition if all failed conditions have messages, otherwise undefined.
 * @public
 */
export function checkConditions(context: CommandContextResolvable, command: Command): string | null;

export function checkConditions(
    context: CommandContextResolvable,
    source: Command | CommandCondition[]
): string | null {
    if (!Array.isArray(source))
        source = source.conditions;
    
    return source
        .map(condition => checkCondition(context, condition))
        .filter(result => result)[0] ?? null;
}

export { InVoiceChannel } from "./InVoiceChannel.js";
export { InVoiceWithBot } from "./InVoiceWithBot.js";
