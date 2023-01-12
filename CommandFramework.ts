import { Command } from "./definitions";
import { CommandRegistry, CommandRegistryOptions } from "./CommandRegistry";
import { TranslatorManager, TranslatorManagerOptions } from "./TranslatorManager";
import { Client } from "discord.js";
import { InteractionHandler, InteractionHandlerOptions } from "./handlers/InteractionHandler";
import { MessageCreateHandler, MessageHandlerOptions } from "./handlers/MessageCreateHandler";

export interface CommandFrameworkOptions {
    commandRegistryOptions: CommandRegistryOptions;
    translationOptions: TranslatorManagerOptions;
    interactionCommands?: InteractionHandlerOptions;
    messageCommands?: MessageHandlerOptions;
}

export class CommandFramework {
    get commands(): ReadonlyMap<string, Readonly<Command>> {
        if (!this.commandRegistry)
            throw new Error(`${this.init.name}() was not called before use of ${this.constructor.name} instance.`);
        return this.commandRegistry.commands;
    }
    commandRegistry?: CommandRegistry;

    translatorManager?: TranslatorManager;

    client?: Client;

    messageHandler: MessageCreateHandler | null = null;
    interactionHandler: InteractionHandler | null = null;

    constructor(private options: CommandFrameworkOptions) {}

    async init(client: Client) {
        this.translatorManager = await new TranslatorManager(this.options.translationOptions).init();
        this.commandRegistry = await new CommandRegistry(this.options.commandRegistryOptions, this.translatorManager).createCommands();

        this.client = client;
        if (client.isReady())
            await this.afterClientLogin();
        else
            (client as Client<false>).once("ready", () => this.afterClientLogin());

        return this;
    }

    private async afterClientLogin() {
        await this.attachCommandHandlers();
    }

    private async attachCommandHandlers() {
        if (this.options.messageCommands)
            this.messageHandler = await new MessageCreateHandler(this.client!, this.commandRegistry!, this.options.messageCommands).init();
        if (this.options.interactionCommands)
            this.interactionHandler = await new InteractionHandler(this.client!, this.commandRegistry!, this.options.interactionCommands).init();

        if (!this.options.messageCommands && !this.options.interactionCommands)
            throw new Error("None of command handlers are attached.");
    }
}
