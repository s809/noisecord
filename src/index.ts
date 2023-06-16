/**
 * Command framework.
 * 
 * @example
 * To create a simple bot, use the following code:
 * 
 * - index.ts:
 * ```
 * import { CommandFramework } from "@s809/noisecord";
 * 
 * const commandFramework = CommandFramework.create(client, {
 *     commandRegistryOptions: {
 *         // If you're using TypeScript, properties below should point to a directory with build output;
 *         // Otherwise you'll want to remove "build/" parts.
 *         commandModuleDirectory: "./build/commands"
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
 * 
 * // Create your client anywhere before next line
 * await client.login(token);
 * ```
 * 
 * - commands/mycommand.ts
 * ```
 * import { defineCommand } from "@s809/noisecord";
 * 
 * export default defineCommand({
 *     key: "ping",
 *     handler: req => req.reply("Pong!");
 * });
 * ```
 *
 * @packageDocumentation
 */

export * from "./CommandFramework.js";
export * from "./CommandRegistry.js";
export * from "./conditions/index.js";

export * from "./interfaces/Command.js";
export * from "./interfaces/ContextMenuCommand.js";
export * from "./interfaces/common.js"

export * from "./util.js";
export * from "./helpers/ErrorCollector.js";

export * from "./translations/Translator.js";
export * from "./translations/TranslatorManager.js";
export * from "./translations/TranslationChecker.js";

export * from "./handlers/errors/ArgumentParseError.js";
export * from "./handlers/EventHandler.js"
export * from "./handlers/EventHandlerOptions.js"
export * from "./handlers/CommandRequest.js";
export * from "./handlers/CommandResponse.js";

export * from "./handlers/Interaction/InteractionHandler.js";
export * from "./handlers/Interaction/InteractionCommandRequest.js";
export * from "./handlers/Interaction/InteractionCommandResponse.js";

export * from "./handlers/Message/MessageHandler.js";
export * from "./handlers/Message/MessageCommandRequest.js";
export * from "./handlers/Message/MessageCommandResponse.js";
