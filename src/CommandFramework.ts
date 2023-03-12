import { Command } from "./definitions.js";
import { CommandRegistry, CommandRegistryOptions } from "./CommandRegistry.js";
import { TranslatorManager, TranslatorManagerOptions } from "./TranslatorManager.js";
import { Client } from "discord.js";
import { InteractionHandler, InteractionHandlerOptions } from "./handlers/InteractionHandler.js";
import { MessageHandler, MessageHandlerOptions } from "./handlers/MessageHandler.js";
import { getValueOrThrowInitError } from "./util.js";

/** 
 * Options used to initialize {@link CommandFramework}.
 * @public
 */
export interface CommandFrameworkOptions {
    commandRegistryOptions: CommandRegistryOptions;
    translationOptions: TranslatorManagerOptions;
    interactionCommands?: InteractionHandlerOptions;
    messageCommands?: MessageHandlerOptions;
}

/** 
 * Entry point for using a command framework.
 * @public 
 */
export class CommandFramework {
    /**
     * Tree of commands.
     */
    get commands(): ReadonlyMap<string, Readonly<Command>> {
        if (!this.commandRegistry)
            throw new Error(`${this.init.name}() was not called before use of ${this.constructor.name} instance.`);
        return this.commandRegistry.commands;
    }
    
    get commandRegistry() {
        return getValueOrThrowInitError(this._commandRegistry, this);
    }
    private _commandRegistry?: CommandRegistry;
    
    get translatorManager() {
        return getValueOrThrowInitError(this._translatorManager, this);
    }
    private _translatorManager?: TranslatorManager;

    private client?: Client;

    private messageHandler: MessageHandler | null = null;
    private interactionHandler: InteractionHandler | null = null;

    constructor(private options: CommandFrameworkOptions) {}

    /** 
     * Initializes everything related to the framework.
     */
    async init(client: Client) {
        this._translatorManager = await new TranslatorManager(this.options.translationOptions).init();
        this._commandRegistry = await new CommandRegistry(this.options.commandRegistryOptions, this.translatorManager).createCommands();

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
            this.messageHandler = await new MessageHandler(this.client!, this.commandRegistry!, this.options.messageCommands);
        if (this.options.interactionCommands)
            this.interactionHandler = await new InteractionHandler(this.client!, this.commandRegistry!, this.options.interactionCommands);

        if (!this.options.messageCommands && !this.options.interactionCommands)
            throw new Error("None of command handlers are attached.");
        
        this.messageHandler?.init();
        this.interactionHandler?.init();
    }
}
