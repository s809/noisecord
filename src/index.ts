/**
 * Command framework.
 * 
 * @example
 * ```
 * const commandFramework = CommandFramework.create(client, {
 *     commandRegistryOptions: {
 *         // If you're using TypeScript, properties below should point to a directory with build output;
 *         // Otherwise you'll want to remove "build/" parts.
 *         commandModuleDirectory: "./build/commands",
 *         contextMenuModuleDirectory: "./build/contextMenuCommands"
 *     },
 * 
 *     translationOptions: {
 *         translationFileDirectory: "./translations",
 *         defaultLocale: "en-US",
 *         getUserLocale: () => "en-US",
 *         getGuildLocale:  () => "en-US",
 *     },
 * 
 *     // If you don't need interaction/message commands, simply remove the matching property.
 *     interactionCommands: {
 *         // It has no required properties, but is required for interaction commands (slash/right click) to work.
 *     },
 *     messageCommands: {
 *         prefix: "!"
 *     }
 * });
 * await client.login(token);
 * ```
 *
 * @packageDocumentation
 */

export * from "./CommandFramework.js";
export * from "./CommandRegistry.js";
export * from "./conditions/index.js";

export * from "./definitions/Command.js";
export * from "./definitions/ContextMenuCommand.js";

export * from "./util.js";
export * from "./helpers/ErrorCollector.js";

export * from "./Translator.js";
export * from "./TranslatorManager.js";
export * from "./helpers/TranslationChecker.js";

export * from "./handlers/errors.js";
export * from "./handlers/EventHandler.js"
export * from "./handlers/HandlerOptions.js"
export * from "./handlers/CommandRequest.js";
export * from "./handlers/CommandResponse.js";

export * from "./handlers/Interaction/InteractionHandler.js";
export * from "./handlers/Interaction/InteractionCommandRequest.js";
export * from "./handlers/Interaction/InteractionCommandResponse.js";

export * from "./handlers/Message/MessageHandler.js";
export * from "./handlers/Message/MessageCommandRequest.js";
export * from "./handlers/Message/MessageCommandResponse.js";

