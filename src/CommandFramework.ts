import { CommandRegistry, CommandRegistryOptions } from "./CommandRegistry.js";
import { TranslatorManager, TranslatorManagerOptions } from "./TranslatorManager.js";
import { Client } from "discord.js";
import { _InteractionHandler, InteractionHandlerOptions } from "./handlers/Interaction/InteractionHandler.js";
import { _MessageHandler, MessageHandlerOptions } from "./handlers/Message/MessageHandler.js";
import { _getValueOrThrowInitError } from "./util.js";
import { TranslationChecker } from "./helpers/TranslationChecker.js";
import { EventHandler } from "./handlers/EventHandler.js";
import { isUndefined, omitBy } from "lodash-es";

/** 
 * Options used to initialize {@link CommandFramework}.
 * @public
 */
export interface CommandFrameworkOptions {
    commandRegistryOptions: CommandRegistryOptions;
    translationOptions: TranslatorManagerOptions;
    interactionCommands?: InteractionHandlerOptions;
    messageCommands?: MessageHandlerOptions;
    commonHandlerOptions?: EventHandler.CommonHandlerOptions;
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

    private messageHandler: _MessageHandler | null = null;
    private interactionHandler: _InteractionHandler | null = null;

    constructor(private client: Client, private options: CommandFrameworkOptions) {}

    /**
     * Creates a new instance of the {@link CommandFramework} class.
     * This is a shortcut for constructing and initializing an instance if your instance will reside in the main file.
     * 
     * @remarks
     * Translation checking is not possible using the returned instance, as it uses a window between construction and initialization of an instance.
     * See constructor and {@link CommandFramework.init | init()} 
     * for the case when construction and initialization need to be split.
     */
    static async create(client: Client, options: CommandFrameworkOptions) {
        return await new CommandFramework(client, options).init();
    }

    /**  Initializes everything related to the framework. */
    async init() {
        this._translatorManager = await new TranslatorManager(this.options.translationOptions).init();
        this._commandRegistry = new CommandRegistry(this.options.commandRegistryOptions, this._translatorManager);
        await this._commandRegistry.createCommands();
        this.translationChecker.runChecks(this._translatorManager);

        if (this.client.isReady())
            await this.afterClientLogin();
        else
            (this.client as Client<false>).once("ready", () => this.afterClientLogin());

        return this;
    }

    private async afterClientLogin() {
        await this.attachCommandHandlers();
    }

    private async attachCommandHandlers() {
        const filteredOptions = omitBy(this.options.commonHandlerOptions, isUndefined);
        if (this.options.messageCommands) {
            this.options.messageCommands = {
                ...filteredOptions,
                ...this.options.messageCommands
            };
        }
        if (this.options.interactionCommands) {
            this.options.interactionCommands = {
                ...filteredOptions,
                ...this.options.interactionCommands
            };
        }

        if (![this.options.interactionCommands, this.options.messageCommands].some(x => x))
            throw new Error("None of command handlers are attached.");

        if (this.options.messageCommands)
            this.messageHandler = new _MessageHandler(this.client, this.commandRegistry, this.options.messageCommands);
        if (this.options.interactionCommands)
            this.interactionHandler = await _InteractionHandler.create(this.client, this.commandRegistry, this.options.interactionCommands);
    }
}
