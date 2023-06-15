import { CommandRequest } from "../handlers/CommandRequest.js";
import { Command } from "../interfaces/Command.js";
import { InVoiceChannel } from "./InVoiceChannel.js";
import { InVoiceWithBot } from "./InVoiceWithBot.js";

/**
 * Interface for adding a condition to a command.
 * @public
 */
export interface CommandCondition {
    key: string;
    check: (context: CommandRequest) => boolean;
    satisfiedBy?: CommandCondition | CommandCondition[];
    requires?: CommandCondition | CommandCondition[];
}

/** @public */
export namespace CommandCondition {
    /** @public */
    export const BuiltInConditions = {
        InVoiceChannel,
        InVoiceWithBot
    }
}

/**
 * Checks a provided command condition against a message.
 * 
 * `allowed` is true if the condition is (at least one of):
 * - satisfied with and its subconditions are satisfied
 * - satisfied by any of alternatives
 */
function checkCondition(
    context: CommandRequest,
    condition: CommandCondition
): string | null {
    if (condition.requires) {
        const requires = Array.isArray(condition.requires)
            ? condition.requires
            : [condition.requires];
        const result = _checkConditions(context, requires);
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

    return condition.key;
}

/**
 * Checks the command's list of conditions against a message or a list of command conditions.
 * 
 * `allowed` is true if all conditions are satisfied.
 *
 * `message` is the message of the first failed condition if all failed conditions have messages, otherwise undefined.
 * @internal
 */
export function _checkConditions(
    context: CommandRequest,
    source: Command | CommandCondition[]
): string | null {
    if (!Array.isArray(source))
        source = source.conditions;
    
    return source
        .map(condition => checkCondition(context, condition))
        .filter(result => result)[0] ?? null;
}
