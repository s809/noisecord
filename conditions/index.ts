import { CommandInteraction, Message } from "discord.js";
import { CommandMessage } from "../CommandMessage";
import { Command } from "../definitions";

export interface CommandCondition {
    name: string;
    check: (msg: Message | CommandMessage) => boolean;
    failureMessage: string;
    hideInDescription?: boolean;
    hideCommand?: boolean | ((msg: Message | CommandMessage) => boolean);
    satisfiedBy?: CommandCondition | CommandCondition[];
    requires?: CommandCondition | CommandCondition[];
}

type WithCommandContext = Message | CommandInteraction | CommandMessage;

/**
 * Checks a provided command requirement against a message.
 * 
 * `allowed` is true if the requirement is (at least one of):
 * - overridable and {@link override} is true
 * - satisfied with and its subrequirements are satisfied
 * - satisfied by any of alternatives
 */
function checkCondition(
    msg: WithCommandContext,
    condition: CommandCondition
): CommandConditionCheckResult {
    const forceHide = typeof condition.hideCommand === "function" && condition.hideCommand(msg as any);
    const hideOnFailure = typeof condition.hideCommand === "boolean" && condition.hideCommand
        || forceHide;

    if (condition.requires) {
        const requires = Array.isArray(condition.requires)
            ? condition.requires
            : [condition.requires];
        const result = checkConditions(msg, requires);
        if (!result)
            return result;
    }

    const allowed = condition.check(msg as any);
    if (allowed)
        return null;

    if (condition.satisfiedBy) {
        const satisfiedBy = Array.isArray(condition.satisfiedBy)
            ? condition.satisfiedBy
            : [condition.satisfiedBy];
        const result = satisfiedBy.some(condition => !checkCondition(msg, condition));
        if (result)
            return null;
    }

    return condition.failureMessage;
}

type CommandConditionCheckResult = string | null;

/**
 * Checks the provided list of requirements against a message.
 * 
 * `allowed` is true if all requirements are satisfied. \
 * `message` is the message of the first failed requirement if all failed requirements have messages, otherwise undefined.
 * 
 * @see checkCondition
 */
export function checkConditions(msg: WithCommandContext, conditions: CommandCondition[]): CommandConditionCheckResult;

/**
 * Checks the command's list of requirements against a message.
 * 
 * `allowed` is true if all requirements are satisfied. \
 * `message` is the message of the first failed requirement if all failed requirements have messages, otherwise undefined.
 */
export function checkConditions(msg: WithCommandContext, command: Command): CommandConditionCheckResult;

export function checkConditions(
    msg: WithCommandContext,
    source: Command | CommandCondition[]
): CommandConditionCheckResult {
    let conditions;
    if ((source as Command).conditions)
        conditions = (source as Command).conditions;
    else
        conditions = source as CommandCondition[];
    
    return conditions
        .map(condition => checkCondition(msg, condition))
        .filter(result => result)[0] ?? null;
}

export { InVoiceChannel } from "./InVoiceChannel";
export { InVoiceWithBot } from "./InVoiceWithBot";
