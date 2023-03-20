import { ApplicationCommandDataResolvable, ApplicationCommandOptionType, ApplicationCommandSubGroupData, ApplicationCommandType, Awaitable, CacheType, ChatInputApplicationCommandData, ChatInputCommandInteraction, Client, CommandInteraction, ContextMenuCommandInteraction, Interaction, MessageFlags } from "discord.js";
import { CommandRegistry } from "../CommandRegistry.js";
import { Command, CommandHandler, ContextMenuCommand, ParsedArguments } from "../definitions.js";
import { InteractionCommandRequest } from "../messageTypes/InteractionCommandRequest.js";
import { ArgumentParseError, CommandResultError } from "./errors.js";
import { _HandlerOptions } from "./HandlerOptions.js";
import { _EventHandler } from "./EventHandler.js";
import { Translator } from "../Translator.js";
import assert from "assert";
import { CommandRequest } from "../messageTypes/CommandRequest.js";

type ContainsInteraction = InteractionCommandRequest | ContextMenuCommandInteraction;

/** 
 * Options for setting up an interaction handler.
 * @public 
 */
export interface InteractionHandlerOptions extends _HandlerOptions<CommandRequest | ContextMenuCommandInteraction> {
    registerApplicationCommands?: boolean;
}

/** @internal */
export class _InteractionHandler extends _EventHandler<[Interaction], Required<InteractionHandlerOptions>> {
    protected readonly eventName = "interactionCreate";

    constructor(client: Client, commandRegistry: CommandRegistry, options: InteractionHandlerOptions) {
        const getInteraction = (req: ContainsInteraction) => {
            if (req instanceof InteractionCommandRequest)
                return req.interaction;
            else
                return req;
        }
        
        super(client, commandRegistry, {
            registerApplicationCommands: options.registerApplicationCommands !== false
        }, {
            async onSlowCommand(req: ContainsInteraction) {
                if (req instanceof InteractionCommandRequest) {
                    if (!req.response)
                        await req.deferReply();
                } else {
                    if (!req.deferred && !req.replied) {
                        await req.deferReply({
                            ephemeral: true
                        });
                    }
                }
            },
            async onSuccess(req: ContainsInteraction) {
                const interaction = getInteraction(req);
                if (!interaction.deferred && !interaction.replied) {
                    await req.reply({
                        content: "OK",
                        ephemeral: true
                    });
                } else if (interaction.deferred && (await interaction.fetchReply()).flags.has(MessageFlags.Loading)) {
                    await interaction.followUp({
                        content: "OK",
                        ephemeral: true
                    });
                }
            },
            async onFailure(req: ContainsInteraction, e) {
                const content = e instanceof CommandResultError
                    ? e.message
                    : String(e.stack);

                const interaction = getInteraction(req);
                if (!interaction.replied || !(await interaction.fetchReply()).flags.has(MessageFlags.Loading)) {
                    await req.reply({
                        content,
                        ephemeral: true,
                        fetchReply: true
                    });
                } else {
                    await req.channel?.send(content);
                }
            },
        });
    }

    override async init() {
        await super.init();
        if (this.options.registerApplicationCommands)
            await this.registerApplicationCommands();
        return this;
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

        // Parse arguments
        let argsObj: ParsedArguments;
        try {
            argsObj = await this.parseArguments(interaction.options, command, translator);
        } catch (e) {
            if (!(e instanceof ArgumentParseError))
                throw e;

            await interaction.reply({
                content: e.message,
                ephemeral: true
            });
            return;
        }

        const commandTranslator = await this.translatorManager.getTranslator(interaction, command.translationPath);
        const CommandRequest = new InteractionCommandRequest(command, commandTranslator, interaction);
        await this.executeCommand(CommandRequest, () => command.handler!(CommandRequest, argsObj), commandTranslator);
    }

    private async handleContextMenuInteraction(interaction: ContextMenuCommandInteraction) {
        const translator = await this.translatorManager.getTranslator(interaction, "command_processor");
        
        const command = this.commandRegistry.commandsById.get(interaction.command!.id) as ContextMenuCommand;
        if (!command || !command.handler)
            return this.replyUnknownCommand(interaction, translator);

        const commandTranslator = await this.translatorManager.getTranslator(interaction, this.commandRegistry.getCommandTranslationPath(command.key, true));
        await this.executeCommand(interaction, () => command.handler(interaction as any, commandTranslator), commandTranslator);
    }

    private async parseArguments(interactionOptions: ChatInputCommandInteraction["options"], command: Command, translator: Translator): Promise<ParsedArguments> {
        const argsObj = {} as Parameters<CommandHandler>["1"];
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
            if (!getter)
                throw new ArgumentParseError(translator.translate("errors.unsupported_argument_type"));

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
