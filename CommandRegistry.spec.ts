import assert from "assert";
import { CommandRegistry, CommandRegistryOptions } from "./CommandRegistry";
import { TranslatorManager } from "./TranslatorManager";

const options: CommandRegistryOptions = {
    commandModuleDirectory: "./testData/commands/normal",
    contextMenuModuleDirectory: "./testData/contextMenuCommands/normal"
};

describe("CommandRegistry", () => {
    let translatorManager: TranslatorManager;
    let commandRegistry: CommandRegistry;

    before(async () => { 
        translatorManager = await new TranslatorManager({
            translationFileDirectory: "./testData/translations/normal",
            defaultLocale: "en-US",
            getUserLanguage: async () => "ru",
            getGuildLanguage: async () => "ru",
        }).init();
        commandRegistry = new CommandRegistry(options, translatorManager);
    });

    it("normal", () => commandRegistry.createCommands());

    it("errors", async () => {
        const translatorManager = await new TranslatorManager({
            translationFileDirectory: "./testData/translations/normal",
            defaultLocale: "en-US",
            getUserLanguage: async () => "ru",
            getGuildLanguage: async () => "ru",
        }).init();

        const promise = new CommandRegistry({
            commandModuleDirectory: "./testData/commands/errors",
            contextMenuModuleDirectory: "./testData/contextMenuCommands/normal"
        }, translatorManager).createCommands();

        assert.rejects(promise);
    });
});
