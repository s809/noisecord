import { ApplicationCommandChannelOptionData, ApplicationCommandNumericOptionData, ApplicationCommandOptionType, ApplicationCommandPermissions, ApplicationCommandPermissionType, ApplicationCommandStringOptionData, Awaitable, CachedManager, Client, Guild, GuildChannel, Message, PermissionFlagsBits, PermissionsBitField, Snowflake } from "discord.js";
import { CommandRegistry } from "../../CommandRegistry.js";
import { _checkConditions } from "../../conditions/index.js";
import { Command } from "../../interfaces/Command.js";
import { MessageCommandRequest } from "./MessageCommandRequest.js";
import { Translator } from "../../translations/Translator.js";
import { parseChannelMention, parseRoleMention, parseUserMention } from "../../util.js";
import { ArgumentParseError } from "../errors/ArgumentParseError.js";
import { CommandResultError } from "../errors/CommandResultError.js";
import { EventHandlerOptions } from "../EventHandlerOptions.js";
import { EventHandler } from "../EventHandler.js";
import { IterableElement } from "type-fest";

/** 
 * Default emote for loading state on a message command.
 * @public 
 */
export const loadingEmoji = "🔄";

/** 
 * Default emote for success state on a message command.
 * @public 
 */
export const successEmoji = "✅";

/** 
 * Default emote for failure state on a message command.
 * @public 
 */
export const failureEmoji = "❌";

/** 
 * Options for setting up a message handler.
 * @public 
 */
export interface MessageHandlerOptions extends Partial<EventHandlerOptions> {
    /**
     * Sets a prefix.
     * 
     * When it's a map:
     * - Its key must be a guild ID, or `null` for default prefix;
     * - If `null` key is not present, commands outside specified guilds will be ignored.
     */
    prefix: string | Map<Snowflake | null, string> | ((msg: Message) => Awaitable<string | null>);
    
    /**
     * Allows specific users to execute any commands (including owner-only) regardless of any permissions.
     */
    ignoreAllPermissionsFor?: Snowflake | Snowflake[] | ((msg: Message, command: Command) => Awaitable<boolean>);

    /**
     * Allows specific users to execute owner-only commands.
     */
    ignoreOwnerOnlyFor?: Snowflake | Snowflake[] | ((msg: Message, command: Command) => Awaitable<boolean>);
};

/** @internal */
export interface _MessageHandlerConvertedOptions extends EventHandlerOptions<MessageCommandRequest> {
    getPrefix: (msg: Message) => Awaitable<string | null>;
    shouldIgnoreAllPermissions: (msg: Message, command: Command) => Awaitable<boolean>;
    shouldIgnoreOwnerOnly: (msg: Message, command: Command) => Awaitable<boolean>;
};

/** @internal */
export class _MessageHandler extends EventHandler<_MessageHandlerConvertedOptions, "messageCreate"> {
    constructor(client: Client, commandRegistry: CommandRegistry, options: MessageHandlerOptions) {
        const shouldIgnore = (option?: Snowflake | Snowflake[] | ((msg: Message, command: Command) => Awaitable<boolean>)) => {
            return (msg: Message, command: Command) => {
                if (typeof option === "string") return msg.author.id === option;
                if (Array.isArray(option))
                    return option.includes(msg.author.id);
                if (option)
                    return option(msg, command);
                return false;
            };
        };
        
        super(client, "messageCreate", commandRegistry, {
            ...options,
            getPrefix(msg) {
                if (typeof options.prefix === "string") return options.prefix;
                if (options.prefix instanceof Map) return options.prefix.get(msg.guildId ?? "")
                    ?? options.prefix.get(msg.author.id)
                    ?? options.prefix.get(null)
                    ?? null;
                return options.prefix(msg);
            },
            shouldIgnoreAllPermissions: shouldIgnore(options.ignoreAllPermissionsFor),
            shouldIgnoreOwnerOnly: shouldIgnore(options.ignoreOwnerOnlyFor)
        }, {
            async onSlowCommand(req) {
                await req.message.react(loadingEmoji).catch(() => { });
            },
            async onSuccess(req) {
                await Promise.allSettled([
                    req.message.reactions.resolve(loadingEmoji)?.users.remove(),
                    req.message.react(successEmoji)
                ]);
            },
            async onFailure(req, e) {
                await Promise.allSettled([
                    req.message.reactions.resolve(loadingEmoji)?.users.remove(),
                    req.message.react(failureEmoji),
                    req.replyOrEdit(e instanceof CommandResultError
                        ? e.message
                        : String(e.stack))
                ]);
            }
        });
    }

    async handle(msg: Message) {
        if (msg.author.bot || msg.webhookId) return;

        const prefix = await this.options.getPrefix(msg);
        if (!prefix || !msg.content.startsWith(prefix)) return;

        const translator = await this.translatorManager.getTranslator(msg, "command_processor");

        const parts = this.splitByWhitespace(msg.content.slice(prefix.length));
        const command = this.commandRegistry.resolveCommandByLocalizedPath(parts, translator);
        if (!command || !command.handler) return;

        if (!(await this.checkCommandPermissions(msg, command)))
            return;

        const commandTranslator = await this.translatorManager.getTranslator(msg, command.translationPath);
        const commandRequest = new MessageCommandRequest(command, commandTranslator, msg, prefix);

        // Check conditions
        const condFailureKey = _checkConditions(commandRequest, command);
        if (condFailureKey) {
            await this.replyConditionsUnsatisfied(commandRequest, condFailureKey, translator);
            return;
        }

        // Parse arguments
        let argsObj: Command.HandlerArguments;
        try {
            argsObj = await this.parseArguments(msg, parts, command, translator);
        } catch (e) {
            if (!(e instanceof ArgumentParseError))
                throw e;
            
            await this.replyInvalidArguments(commandRequest, command, e, translator);
            return;
        }

        await this.executeCommand(commandRequest, () => command.handler!(commandRequest, argsObj), commandTranslator);
    }

    private async checkCommandPermissions(msg: Message, command: Command): Promise<boolean> {
        // Owner only check
        if (command.ownerOnly) {
            return (await this.options.shouldIgnoreAllPermissions(msg, command)) ||
                this.options.shouldIgnoreOwnerOnly(msg, command);
        }

        // For DMs: check if DMs are allowed
        if (!msg.inGuild())
            return command.allowDMs;

        // For guilds: check permissions
        const requiredPermissions = new PermissionsBitField(command.defaultMemberPermissions ?? [])
            .remove(PermissionFlagsBits.UseApplicationCommands);
        let allowed = msg.member!.permissions.has(requiredPermissions);

        // Interaction command, if registered
        if (command.interactionCommand?.id) {
            const overwrites = await this.client.application!.commands.permissions.fetch({
                guild: msg.guild,
                command: command.interactionCommand.id
            }).catch(() => [] as ApplicationCommandPermissions[]);

            let allowedInChannel = true;
            let rolePosition = -1;
            checkOverwrites:
            for (const overwrite of overwrites) {
                switch (overwrite.type) {
                    case ApplicationCommandPermissionType.Role:
                        const role = msg.member!.roles.resolve(overwrite.id);
                        if (role && role.position > rolePosition)
                            allowed = overwrite.permission;
                        break;
                    case ApplicationCommandPermissionType.User:
                        if (overwrite.id === msg.author.id) {
                            allowed = overwrite.permission;
                            rolePosition = Infinity;
                        }
                        break;
                    case ApplicationCommandPermissionType.Channel:
                        if (overwrite.id === msg.channelId) {
                            allowedInChannel = overwrite.permission;

                            if (!overwrite.permission)
                                break checkOverwrites;
                        } else if (BigInt(overwrite.id) === BigInt(msg.guildId) - 1n) {
                            allowedInChannel = overwrite.permission;
                        }
                        break;
                }
            }

            allowed &&= allowedInChannel;
        }

        return allowed || this.options.shouldIgnoreAllPermissions(msg, command);
    }

    private async parseArguments(msg: Message, parts: string[], command: Command, translator: Translator): Promise<Command.HandlerArguments> {
        const partsToSkip = parts.splice(0, command.path.split("/").length);

        const argCount = parts.length;
        const minArgs = command.args.min, maxArgs = command.args.max;
        if (argCount < minArgs) {
            throw new ArgumentParseError("too_few_arguments", false, {
                argCount,
                minArgs
            });
        }
        if (argCount > maxArgs) {
            throw new ArgumentParseError("too_many_arguments", false, {
                argCount,
                maxArgs
            });
        }

        const argsObj = {} as Parameters<Command.Handler>["1"];
        const argToGetter = new Map<ApplicationCommandOptionType, (key: string, value: string, arg: IterableElement<NonNullable<Command>["args"]["list"]>) => any>([
            [ApplicationCommandOptionType.String, (key, value, arg) => {
                const arga = arg as ApplicationCommandStringOptionData;

                if (arga.choices) {
                    // Transform localized choice to internal value
                    for (const choice of arga.choices) {
                        const localization = (choice.nameLocalizations as any)[translator.localeString];
                        if (localization && value.toLocaleLowerCase() === localization // translator's locale
                            || value.toLocaleLowerCase() === choice.name) // default locale
                            return choice.value;
                    }

                    throw new ArgumentParseError("value_not_allowed", true, {
                        argKey: key,
                        argValue: value,
                        ...this.getAllowedValues(arga.choices.map(choice => `"${(choice.nameLocalizations as any)[translator.localeString] ?? choice.name}"`))
                    });
                } else {
                    if (arga.minLength && value.length < arga.minLength) {
                        throw new ArgumentParseError("value_too_short", true, {
                            argKey: key,
                            argValue: value,
                            minLength: arga.minLength
                        });
                    }
                    if (arga.maxLength && value.length > arga.maxLength) {
                        throw new ArgumentParseError("value_too_long", true, {
                            argKey: key,
                            argValue: value,
                            maxLength: arga.maxLength
                        });
                    }
                }

                return value;
            }],
            [ApplicationCommandOptionType.Number, (key, value, arg) => this.parseNumberValue(key, value, arg, isFinite)],
            [ApplicationCommandOptionType.Integer, (key, value, arg) => this.parseNumberValue(key, value, arg, Number.isSafeInteger)],
            [ApplicationCommandOptionType.Boolean, (key, value) => {
                // Merge boolean values of current and fallback translators
                const merged = translator.booleanValues.map((v, i) => translator.fallback
                    ? v.concat(translator.fallback.booleanValues[i])
                    : v);
                for (const [i, variants] of merged.entries()) {
                    if (variants.includes(value.toLocaleLowerCase()))
                        return Boolean(i);
                }

                throw new ArgumentParseError("value_not_allowed", true, {
                    argKey: key,
                    argValue: value,
                    ...this.getAllowedValues(merged.flat())
                });
            }],
            [ApplicationCommandOptionType.Channel, (key, value, arg) => {
                const resolvedChannel: GuildChannel = this.parseResolvableValue(key, value, parseChannelMention, msg.guild?.channels, "invalid_channel");
                const fits = (arg as ApplicationCommandChannelOptionData).channelTypes?.some(type => resolvedChannel.type === type) ?? true;
                if (fits)
                    return resolvedChannel;

                throw new ArgumentParseError("channel_constraints_not_met", true, {
                    argKey: key,
                    argValue: resolvedChannel.toString()
                });
            }],
            [ApplicationCommandOptionType.User, (key, value) => this.parseResolvableValue(key, value, parseUserMention, msg.guild?.members, "invalid_user")],
            [ApplicationCommandOptionType.Role, (key, value) => this.parseResolvableValue(key, value, parseRoleMention, msg.guild?.roles, "invalid_role")],
        ]);

        for (const arg of command.args.lastArgumentType ? command.args.list.slice(0, -1) : command.args.list) {
            const argValue = parts.shift()!;
            partsToSkip.push(argValue);

            const getter = argToGetter.get(arg.type);
            if (!getter) {
                throw new ArgumentParseError("unsupported_argument_type", true, {
                    argKey: arg.key,
                    argValue,
                    type: ApplicationCommandOptionType[arg.type]
                });
            }
            if (!arg.required && !argValue)
                continue;

            argsObj[arg.key] = getter(arg.key, argValue, arg);
        }

        // Append remaining arguments to extras/raw argument
        const lastArg = command.args.list[command.args.list.length - 1];
        switch (command.args.lastArgumentType) {
            case "extras":
                argsObj[lastArg.key] = parts;
                break;
            case "raw":
                argsObj[lastArg.key] = this.skipStringParts(msg.content, ...partsToSkip);
                break;
        }

        return argsObj;
    }

    private getAllowedValues(values: string[]): ArgumentParseError.SingleCauseMap["value_not_allowed"] {
        return {
            allowedValuesItems: values,
            allowedValues: values.join(", ")
        };
    }

    // Combined for numeric & integer
    private parseNumberValue(
        key: string,
        value: string,
        arg: IterableElement<NonNullable<Command>["args"]["list"]>,
        check: (x: number) => boolean
    ) {
        const parsed = parseInt(value);
        const arga = arg as ApplicationCommandNumericOptionData;

        if (!check(parsed)) {
            throw new ArgumentParseError("invalid_numeric", true, {
                argKey: key,
                argValue: value
            });
        }
        if (arga.choices && !arga.choices.some(c => c.value === parsed)) {
            throw new ArgumentParseError("value_not_allowed", true, {
                argKey: key,
                argValue: value,
                ...this.getAllowedValues(arga.choices.map(c => c.value.toString()))
            });
        }
        if (arga.minValue && parsed < arga.minValue) {
            throw new ArgumentParseError("value_too_small", true, {
                argKey: key,
                argValue: value,
                minValue: arga.minValue
            });
        }
        if (arga.maxValue && parsed > arga.maxValue) {
            throw new ArgumentParseError("value_too_large", true, {
                argKey: key,
                argValue: value,
                maxValue: arga.maxValue
            });
        }

        return parsed;
    }

    // For objects obtainable with their managers
    private parseResolvableValue(
        key: string,
        value: string,
        parse: (text: string) => string | null,
        manager: CachedManager<Snowflake, any, any> | undefined,
        errorName: keyof ArgumentParseError.SingleCauseMap
    ) {
        const id = parse(value);
        if (id === null) {
            throw new ArgumentParseError(errorName, true, {
                argKey: key,
                argValue: value
            });
        }

        const result = manager?.resolve(id);
        if (!result) {
            throw new ArgumentParseError(errorName, true, {
                argKey: key,
                argValue: value
            });
        }

        return result;
    }

    private skipStringParts(text: string, ...parts: string[]) {
        for (let part of parts) {
            part = part.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"");
            text = text.slice(text.indexOf(part) + part.length + 1 /* possible quote symbol */);
        }
    
        return text.trimStart();
    }
}
