import { ApplicationCommandDataResolvable, ApplicationCommandOptionType, ApplicationCommandSubGroupData, ApplicationCommandType, Awaitable, CacheType, ChatInputApplicationCommandData, ChatInputCommandInteraction, Client, CommandInteraction, ContextMenuCommandInteraction, Interaction, MessageFlags } from "discord.js";
import { CommandRegistry } from "../../CommandRegistry.js";
import { Command } from "../../interfaces/Command.js";
import { InteractionCommandRequest } from "./InteractionCommandRequest.js";
import { ArgumentParseError } from "../errors/ArgumentParseError.js";
import { CommandResultError } from "../errors/CommandResultError.js";
import { EventHandlerOptions } from "../EventHandlerOptions.js";
import { EventHandler } from "../EventHandler.js";
import { Translator } from "../../Translator.js";
import assert from "assert";
import { ContextMenuCommand } from "../../interfaces/ContextMenuCommand.js";
import { _checkConditions } from "../../conditions/index.js";

/** 
 * Options for setting up an interaction handler.
 * @public 
 */
export interface InteractionHandlerOptions extends Partial<EventHandlerOptions<InteractionCommandRequest<any, any>>> {
    registerApplicationCommands?: boolean;
}

/** @internal */
export class _InteractionHandler extends EventHandler<Required<InteractionHandlerOptions>, "interactionCreate"> {
    static async create(client: Client, commandRegistry: CommandRegistry, options: InteractionHandlerOptions) {
        const handler = new _InteractionHandler(client, commandRegistry, options);

        if (options.registerApplicationCommands ??= true)
            await handler.registerApplicationCommands();
        
        return handler;
    }

    /** @internal */
    constructor(client: Client, commandRegistry: CommandRegistry, options: InteractionHandlerOptions) {
        super(client, "interactionCreate", commandRegistry, {
            ...options,
            registerApplicationCommands: options.registerApplicationCommands ?? true
        }, {
            async onSlowCommand(req: InteractionCommandRequest<any, any>) {
                await req.deferReply();
            },
            async onSuccess(req: InteractionCommandRequest<any, any>) {
                if (req.response.repliedFully) return;

                await req.replyOrEdit({
                    content: "OK",
                    ephemeral: true,
                }).catch(() => { });
            },
            async onFailure(req: InteractionCommandRequest<any, any>, e) {
                const content = e instanceof CommandResultError
                    ? e.message
                    : String(e.stack);

                if (!req.response.repliedFully)
                    await req.replyOrEdit({ content }).catch(() => { });
                else
                    await req.followUpForce({ content }).catch(() => { });
            }
        });
    }

    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        if (interaction.isChatInputCommand())
            await this.handleChatInteraction(interaction);
        else if (interaction.isContextMenuCommand())
            await this.handleContextMenuInteraction(interaction);
    }

    private async replyUnknownCommand(interaction: CommandInteraction, translator: Translator) {
        await interaction.reply({
            content: translator.translate("errors.unknown_command"),
            ephemeral: true
        });
    }

    private async handleChatInteraction(interaction: ChatInputCommandInteraction) {
        const translator = await this.translatorManager.getTranslator(interaction, "command_processor");

        const path = [
            interaction.command!.name,
            interaction.options.getSubcommandGroup(false),
            interaction.options.getSubcommand(false)
        ].filter(x => x).join('/');

        const command = (this.commandRegistry.commandsById
            .get(interaction.command!.id) as Map<string, Command>)
            ?.get(path);
        if (!command || !command.handler)
            return this.replyUnknownCommand(interaction, translator);

        const commandTranslator = await this.translatorManager.getTranslator(interaction, command.translationPath);
        const commandRequest = new InteractionCommandRequest(command, commandTranslator, interaction);

        // Check conditions
        const condFailureKey = _checkConditions(commandRequest, command);
        if (condFailureKey) {
            await this.replyConditionsUnsatisfied(commandRequest, condFailureKey, translator);
            return;
        }

        // Parse arguments
        let argsObj: Command.HandlerArguments;
        try {
            argsObj = await this.parseArguments(interaction.options, command);
        } catch (e) {
            if (!(e instanceof ArgumentParseError))
                throw e;

            await this.replyInvalidArguments(commandRequest, command, e, translator);
            return;
        }

        await this.executeCommand(commandRequest, () => command.handler!(commandRequest, argsObj), commandTranslator);
    }

    private async handleContextMenuInteraction(interaction: ContextMenuCommandInteraction) {
        const translator = await this.translatorManager.getTranslator(interaction, "command_processor");
        
        const command = this.commandRegistry.commandsById.get(interaction.command!.id) as ContextMenuCommand;
        if (!command || !command.handler)
            return this.replyUnknownCommand(interaction, translator);

        const commandTranslator = await this.translatorManager.getTranslator(interaction, this.commandRegistry.getCommandTranslationPath(command.key, true));
        const commandRequest = new InteractionCommandRequest(command, commandTranslator, interaction);
        await this.executeCommand(commandRequest, () => command.handler(commandRequest as any), commandTranslator);
    }

    private async parseArguments(interactionOptions: ChatInputCommandInteraction["options"], command: Command): Promise<Command.HandlerArguments> {
        const argsObj = {} as Parameters<Command.Handler>["1"];
        const argToGetter = new Map<ApplicationCommandOptionType, (name: string, require?: boolean) => any>([
            [ApplicationCommandOptionType.String, interactionOptions.getString],
            [ApplicationCommandOptionType.Number, interactionOptions.getNumber],
            [ApplicationCommandOptionType.Integer, interactionOptions.getInteger],
            [ApplicationCommandOptionType.Boolean, interactionOptions.getBoolean],
            [ApplicationCommandOptionType.Channel, interactionOptions.getChannel],
            [ApplicationCommandOptionType.User, interactionOptions.getUser],
            [ApplicationCommandOptionType.Role, interactionOptions.getRole],
        ]);

        for (const arg of command.args.list) {
            let getter = argToGetter.get(arg.type);
            if (!getter) {
                throw new ArgumentParseError("unsupported_argument_type", true, {
                    argKey: arg.key,
                    argValue: "null",
                    type: ApplicationCommandOptionType[arg.type]
                });
            }

            argsObj[arg.key] = getter.bind(interactionOptions)(arg.name)!;
        }

        if (command.args.lastArgAsExtras) {
            const key = command.args.list[command.args.list.length - 1].key;
            argsObj[key] = this.splitByWhitespace(argsObj[key] as string);
        }

        return argsObj;
    }

    private async registerApplicationCommands() {
        const chatCommands = this.makeChatCommands();
        const contextMenuCommands = this.commandRegistry.contextMenuCommands;

        const result = await this.client.application!.commands.set(
            (chatCommands as ApplicationCommandDataResolvable[])
                .concat(contextMenuCommands.map(({ appCommandData }) => appCommandData))
        );

        const rootCommands = [...this.commandRegistry.commands.values()];
        for (const appCommand of result.values()) {
            switch (appCommand.type) {
                case ApplicationCommandType.ChatInput: {
                    const command = rootCommands.find(x => x.key === appCommand.name);
                    assert(command, `Failed to find source command for ${appCommand.name}`);
                    command.interactionCommand!.id = appCommand.id;

                    // Add into commandsById
                    let commands = this.commandRegistry.commandsById.get(appCommand.id) as Map<string, Command>;
                    if (!commands) {
                        commands = new Map();
                        this.commandRegistry.commandsById.set(appCommand.id, commands);
                    }
                    commands.set(command.path, command);

                    for (const childCommand of this.commandRegistry.iterateSubcommands(command.subcommands)) {
                        if (childCommand.interactionCommand) {
                            childCommand.interactionCommand.id = appCommand.id;
                            commands.set(childCommand.path, childCommand);
                        }
                    }
                    break;
                }
                case ApplicationCommandType.Message:
                case ApplicationCommandType.User: {
                    const command = contextMenuCommands.find(command => appCommand.name === command.appCommandData.name);
                    if (command) {
                        command.appCommandId = appCommand.id;

                        // Add into commandsById
                        this.commandRegistry.commandsById.set(appCommand.id, command);
                    }
                    break;
                }
            }
        }
    }

    private makeChatCommands() {
        const commands: ChatInputApplicationCommandData[] = [];

        for (const command of this.commandRegistry.iterateCommands()) {
            if (!command.interactionCommand)
                continue;

            try {
                if (!command.interactionCommand)
                    continue;

                const data: ChatInputApplicationCommandData & {
                    options: typeof command.args.list;
                } = {
                    name: command.key,
                    description: command.descriptionTranslations[this.translatorManager.fallbackLocale]!,
                    nameLocalizations: command.nameTranslations,
                    descriptionLocalizations: command.descriptionTranslations,
                    options: command.args.list,
                    dmPermission: command.allowDMs,
                    defaultMemberPermissions: command.defaultMemberPermissions
                };
                assert(data.name);

                const pathParts = command.path.split('/');
                switch (pathParts.length) {
                    case 1:
                        commands.push({
                            ...data,
                            type: ApplicationCommandType.ChatInput,
                        });
                        break;
                    case 2:
                        const c = commands.find(c => c.name === pathParts[0])!;
                        c.options ??= [];
                        c.options.push({
                            ...data,
                            type: ApplicationCommandOptionType.Subcommand,
                        });
                        break;
                    case 3:
                        const cc = commands.find(c => c.name === pathParts[0])!;
                        const s = cc.options!.find(s => s.name === pathParts[1])! as ApplicationCommandSubGroupData;
                        s.type = ApplicationCommandOptionType.SubcommandGroup;
                        s.options ??= [];
                        s.options.push({
                            ...data,
                            type: ApplicationCommandOptionType.Subcommand,
                        });
                        break;
                    default:
                        throw new Error("Command depth was exceeded.");
                }
            } catch (e) {
                e.message += `\nPath: ${command.path}`;
                throw e;
            }
        }

        return commands;
    }
}
