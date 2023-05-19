import { CommandRegistry, CommandRegistryOptions } from "./CommandRegistry.js";
import { TranslatorManager, TranslatorManagerOptions } from "./TranslatorManager.js";
import { Client } from "discord.js";
import { _InteractionHandler, InteractionHandlerOptions } from "./handlers/Interaction/InteractionHandler.js";
import { _MessageHandler, MessageHandlerOptions } from "./handlers/Message/MessageHandler.js";
import { _getValueOrThrowInitError } from "./util.js";
import { TranslationChecker } from "./helpers/TranslationChecker.js";

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
    get commands() {
        return _getValueOrThrowInitError(this._commandRegistry?.commands, this);
    }
    
    /** @see CommandRegistry */
    get commandRegistry() {
        return _getValueOrThrowInitError(this._commandRegistry, this);
    }
    private _commandRegistry?: CommandRegistry;
    
    /** @see TranslatorManager */
    get translatorManager() {
        return _getValueOrThrowInitError(this._translatorManager, this);
    }
    private _translatorManager?: TranslatorManager;
    readonly translationChecker = new TranslationChecker();

    private client?: Client;

    private messageHandler: _MessageHandler | null = null;
    private interactionHandler: _InteractionHandler | null = null;

    constructor(private options: CommandFrameworkOptions) {}

    /** 
     * Initializes everything related to the framework.
     */
    async init(client: Client) {
        this._translatorManager = await new TranslatorManager(this.options.translationOptions).init();
        this._commandRegistry = new CommandRegistry(this.options.commandRegistryOptions, this._translatorManager);
        await this._commandRegistry.createCommands();
        this.translationChecker.runChecks(this._translatorManager);

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
            this.messageHandler = new _MessageHandler(this.client!, this.commandRegistry!, this.options.messageCommands);
        if (this.options.interactionCommands)
            this.interactionHandler = new _InteractionHandler(this.client!, this.commandRegistry!, this.options.interactionCommands);

        if (!this.options.messageCommands && !this.options.interactionCommands)
            throw new Error("None of command handlers are attached.");
        
        await this.messageHandler?.init();
        await this.interactionHandler?.init();
    }
}
