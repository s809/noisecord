import { ApplicationCommandChannelOptionData, ApplicationCommandNumericOptionData, ApplicationCommandOptionType, ApplicationCommandPermissions, ApplicationCommandPermissionType, ApplicationCommandStringOptionData, Awaitable, CachedManager, Client, Guild, GuildChannel, Message, PermissionFlagsBits, PermissionsBitField, Snowflake } from "discord.js";
import { CommandRegistry } from "../../CommandRegistry.js";
import { checkConditions } from "../../conditions/index.js";
import { Command, CommandHandler, ParsedArguments } from "../../definitions/Command.js";
import { MessageCommandRequest } from "./MessageCommandRequest.js";
import { Translator } from "../../Translator.js";
import { parseChannelMention, parseRoleMention, parseUserMention } from "../../util.js";
import { ArgumentParseError, CommandResultError } from "../errors.js";
import { _HandlerOptions } from "../HandlerOptions.js";
import { _EventHandler } from "../EventHandler.js";
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
export interface MessageHandlerOptions extends _HandlerOptions {
    /**
     * Sets a prefix.
     * 
     * When it's a map:
     * - Its key must be a guild ID, or `null` for default prefix;
     * - If `null` key is not present, commands outside specified guilds will be ignored.
     * 
     * A function can be passed if there's a need for custom processing.
     */
    prefix: string | Map<Snowflake | null, string> | ((msg: Message) => Awaitable<string | null>);
    
    /**
     * Allows specific users to execute any commands (including owner-only) regardless of any permissions.
     *
     * A function can be passed if there's a need for custom processing.
     */
    ignoreAllPermissionsFor?: Snowflake | Snowflake[] | ((msg: Message, command: Command) => Awaitable<boolean>);

    /**
     * Allows specific users to execute owner-only commands.
     *
     * A function can be passed if there's a need for custom processing.
     */
    ignoreOwnerOnlyFor?: Snowflake | Snowflake[] | ((msg: Message, command: Command) => Awaitable<boolean>);
};

/** @internal */
export interface _MessageHandlerConvertedOptions extends Required<_HandlerOptions> {
    getPrefix: (msg: Message) => Awaitable<string | null>;
    shouldIgnoreAllPermissions: (msg: Message, command: Command) => Awaitable<boolean>;
    shouldIgnoreOwnerOnly: (msg: Message, command: Command) => Awaitable<boolean>;
};

/** @internal */
export class _MessageHandler extends _EventHandler<_MessageHandlerConvertedOptions, "messageCreate"> {
    protected readonly eventName = "messageCreate";

    constructor(client: Client, commandRegistry: CommandRegistry, options: MessageHandlerOptions) {
        const shouldIgnore = (option?: Snowflake | Snowflake[] | ((msg: Message, command: Command) => Awaitable<boolean>)) => {
            return (msg: Message, command: Command) => {
                if (typeof option === "string")
                    return msg.author.id === option;
                if (Array.isArray(option))
                    return option.includes(msg.author.id);
                if (option)
                    return option(msg, command);
                return false;
            };
        };
        
        super(client, commandRegistry, {
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
            async onSlowCommand(req: MessageCommandRequest) {
                await req.message.react(loadingEmoji).catch(() => { });
            },
            async onSuccess(req: MessageCommandRequest) {
                await Promise.allSettled([
                    req.message.reactions.resolve(loadingEmoji)?.users.remove(),
                    req.message.react(successEmoji)
                ]);
            },
            async onFailure(req: MessageCommandRequest, e) {
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
        parts.splice(0, command.path.split("/").length);

        if (!(await this.checkCommandPermissions(msg, command)))
            return;

        // Check conditions
        const checkResult = checkConditions(msg, command);
        if (checkResult) {
            await msg.channel.send(checkResult);
            return;
        }

        // Parse arguments
        let argsObj: ParsedArguments;
        try {
            argsObj = await this.parseArguments(parts, command, msg.guild, translator);
        } catch (e) {
            if (!(e instanceof ArgumentParseError))
                throw e;
            
            await msg.channel.send(e.message + "\n"
                + translator.translate("strings.command_usage", { usage: this.commandRegistry.getCommandUsageString(command, prefix, translator) }));
            return;
        }

        const commandTranslator = await this.translatorManager.getTranslator(msg, command.translationPath);
        const commandRequest = new MessageCommandRequest(command, commandTranslator, msg);
        await this.executeCommand(commandRequest, () => command.handler!(commandRequest, argsObj), commandTranslator);
    }

    private async checkCommandPermissions(msg: Message, command: Command): Promise<boolean> {
        // Owner only check
        if (command.ownerOnly) {
            return await this.options.shouldIgnoreAllPermissions(msg, command) ||
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

    private async parseArguments(parts: string[], command: Command, guild: Guild | null, translator: Translator): Promise<ParsedArguments> {
        if (parts.length < command.args.min || parts.length > command.args.max) {
            throw new ArgumentParseError(parts.length < command.args.min
                ? translator.translate("errors.too_few_arguments")
                : translator.translate("errors.too_many_arguments"));
        }

        // Combined for numeric & integer
        const parseNumberValue = (input: string, arg: IterableElement<NonNullable<Command>["args"]["list"]>, check: (x: number) => boolean) => {
            const value = parseInt(input);
            const arga = arg as ApplicationCommandNumericOptionData;

            if (!check(value))
                throw ["invalid_numeric", input];
            if (arga.choices && !arga.choices.some(c => c.value === value)) {

                throw ["value_not_allowed", input, {
                    allowedValues: arga.choices.map(c => c.value).join(", ")
                }];
            }
            if (arga.minValue && value < arga.minValue) {

                throw ["value_too_small", input, {
                    minValue: arga.minValue
                }];
            }
            if (arga.maxValue && value > arga.maxValue) {

                throw ["value_too_large", input, {
                    maxValue: arga.maxValue
                }];
            }

            return value;
        }

        // For objects obtainable with their managers
        function parseResolvableValue(input: string,
            parse: (text: string) => string | null,
            manager: CachedManager<Snowflake, any, any> | undefined,
            errorName: string) {
            const id = parse(input);
            if (id === null)
                throw [errorName, input];

            const result = manager?.resolve(id);
            if (!result)
                throw [errorName, input];

            return result;
        }

        const argsObj = {} as Parameters<CommandHandler>["1"];
        const argToGetter = new Map<ApplicationCommandOptionType, (value: string, arg: IterableElement<NonNullable<Command>["args"]["list"]>) => any>([
            [ApplicationCommandOptionType.String, (input, arg) => {
                const arga = arg as ApplicationCommandStringOptionData;

                if (arga.choices) {
                    // Transform localized choice to internal value
                    for (const choice of arga.choices) {
                        const localization = (choice.nameLocalizations as any)[translator.localeString];
                        if (localization && input.toLocaleLowerCase() === localization // translator's locale
                            || input.toLocaleLowerCase() === choice.name) // default locale
                            return choice.value;
                    }

                    throw ["value_not_allowed", input, {
                        allowedValues: arga.choices.map(choice => `"${(choice.nameLocalizations as any)[translator.localeString] ?? choice.name}"`).join(", ")
                    }];
                } else {
                    if (arga.minLength && input.length < arga.minLength) {

                        throw ["value_too_short", input, {
                            minLength: arga.minLength
                        }];
                    }
                    if (arga.maxLength && input.length > arga.maxLength) {

                        throw ["value_too_long", input, {
                            maxLength: arga.maxLength
                        }];
                    }
                }

                return input;
            }],
            [ApplicationCommandOptionType.Number, (input, arg) => parseNumberValue(input, arg, isFinite)],
            [ApplicationCommandOptionType.Integer, (input, arg) => parseNumberValue(input, arg, Number.isSafeInteger)],
            [ApplicationCommandOptionType.Boolean, input => {
                // Merge boolean values of current and fallback translators
                const merged = translator.booleanValues.map((v, i) => translator.fallback
                    ? v.concat(translator.fallback.booleanValues[i])
                    : v);
                for (const [i, variants] of merged.entries()) {
                    if (variants.includes(input.toLocaleLowerCase()))
                        return Boolean(i);
                }
                throw ["invalid_boolean", input];
            }],
            [ApplicationCommandOptionType.Channel, (input, arg) => {
                const resolvedChannel: GuildChannel = parseResolvableValue(input, parseChannelMention, guild?.channels, "invalid_channel");
                const fits = (arg as ApplicationCommandChannelOptionData).channelTypes?.some(type => resolvedChannel.type === type) ?? true;
                if (!fits)
                    throw ["channel_constraints_not_met", resolvedChannel.toString()];
                return resolvedChannel;
            }],
            [ApplicationCommandOptionType.User, input => parseResolvableValue(input, parseUserMention, guild?.members, "invalid_user")],
            [ApplicationCommandOptionType.Role, input => parseResolvableValue(input, parseRoleMention, guild?.roles, "invalid_role")],
        ]);

        for (const arg of command.args.list) {
            let getter = argToGetter.get(arg.type);
            if (!getter)
                throw new ArgumentParseError(translator.translate("errors.unsupported_argument_type"));

            const argValue = parts.shift()!;
            if (!arg.required && !argValue)
                continue;

            try {
                argsObj[arg.key] = getter(argValue, arg);
            } catch (e) {
                if (Array.isArray(e)) {
                    const argName = translator.getTranslationFromRecord(arg.nameLocalizations!);
                    const valueWithArgName = `"${e[1]}" (${translator.translate("strings.argument_name", { name: argName })})`;

                    e = new ArgumentParseError(translator.translate(`errors.${e[0]}`, {
                        arg: valueWithArgName,
                        ...e[2]
                    }));
                }
                
                throw e;
            }
        }

        // Append remaining arguments to extras argument
        if (command.args.lastArgAsExtras) {
            const lastArg = command.args.list[command.args.list.length - 1];
            parts.unshift(argsObj[lastArg.key] as string ?? "");
            argsObj[lastArg.key] = parts;
        }

        return argsObj;
    }
}
