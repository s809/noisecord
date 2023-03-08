import { expect } from "chai";
import { CommandRegistry } from "./CommandRegistry.js";
import { TranslatorManager } from "./TranslatorManager.js";

describe("CommandRegistry", () => {
    let translatorManager: TranslatorManager;
    let commandRegistry: CommandRegistry;

    beforeEach(async () => { 
        translatorManager = await new TranslatorManager({
            translationFileDirectory: "./testData/translations/normal",
            defaultLocale: "en-US",
            getUserLocale: async () => "ru",
            getGuildLocale: async () => "ru",
        }).init();
        commandRegistry = await new CommandRegistry({
            commandModuleDirectory: "./testData/commands/normal",
            contextMenuModuleDirectory: "./testData/contextMenuCommands/normal"
        }, translatorManager).createCommands();
    });

    it("normal", () => commandRegistry.createCommands());

    it("errors", async function () {
        this.timeout(5000);

        const translatorManager = await new TranslatorManager({
            translationFileDirectory: "./testData/translations/normal",
            defaultLocale: "en-US",
            getUserLocale: async () => "ru",
            getGuildLocale: async () => "ru",
        }).init();

        const promise = new CommandRegistry({
            commandModuleDirectory: "./testData/commands/errors",
            contextMenuModuleDirectory: "./testData/contextMenuCommands/normal"
        }, translatorManager).createCommands();

        await expect(promise).rejectedWith("Errors generated: 8");
    });

    describe("Context menu command creation", () => {
        it("No command directory", async () => {
            commandRegistry = new CommandRegistry({
                commandModuleDirectory: "./testData/commands/normal",
                contextMenuModuleDirectory: undefined
            }, translatorManager);
            await expect(commandRegistry.createContextMenuCommands()).eventually.empty;
        });

        it("Return correct values", async () => {
            expect(await commandRegistry.createContextMenuCommands()).containSubset([
                {
                    key: "cm-message",
                    type: 3,
                    appCommandId: null,
                    appCommandData: {
                        type: 3,
                        name: "cm-message",
                        nameLocalizations: {
                            "en-US": "cm-message"
                        },
                        dmPermission: false
                    }
                },
                {
                    key: "cm-user",
                    type: 2,
                    appCommandId: null,
                    appCommandData: {
                        type: 2,
                        name: "cm-user",
                        nameLocalizations: {
                            "en-US": "cm-user"
                        },
                        dmPermission: false
                    }
                }
            ]);
        });
    });

    describe("Resolve command", () => {
        describe("By normal path", () => {
            it("String handling", () => {
                expect(commandRegistry.resolveCommandByPath("parent/test")).property("path").equal("parent/test");
            });

            describe("Succeed", () => {
                it("Without partial resolve", () => {
                    expect(commandRegistry.resolveCommandByPath(["parent", "test"])).property("path").equal("parent/test");
                });

                it("With partial resolve", () => {
                    expect(commandRegistry.resolveCommandByPath(["parent", "test", "test2"], true)).property("path").equal("parent/test");
                });
            });

            describe("Fail", () => {
                it("Too long path", () => {
                    expect(commandRegistry.resolveCommandByPath(["parent", "test", "test2"])).null;
                });

                it("Invalid path", () => {
                    expect(commandRegistry.resolveCommandByPath(["parent", "test2"])).null;
                });
            });
        });

        describe("By localized path", () => {
            it("String handling", async () => {
                expect(commandRegistry.resolveCommandByLocalizedPath("парент/тест", await translatorManager.getTranslator("ru"))).property("path").equal("parent/test");
            });

            describe("Succeed", () => {
                it("Given locale", async () => {
                    expect(commandRegistry.resolveCommandByLocalizedPath(["парент", "тест"], await translatorManager.getTranslator("ru"))).property("path").equal("parent/test");
                });

                it("Fallback locale", async () => {
                    expect(commandRegistry.resolveCommandByLocalizedPath(["parent", "test"], await translatorManager.getTranslator("ru"))).property("path").equal("parent/test");
                });
            });

            it("Fail without fallback", async () => {
                expect(commandRegistry.resolveCommandByLocalizedPath(["parent", "test"], await translatorManager.getTranslator("ru"), false)).null;
            });
        });
    });

    describe(`#${CommandRegistry.prototype.getCommandUsageString.name}`, () => {
        it("Fallback locale", () => {
            expect(commandRegistry.getCommandUsageString(
                commandRegistry.resolveCommandByPath("parent/test")!,
                "!",
                translatorManager.fallbackTranslator
            )).equal("!parent test <arg> <arg2...>");
        });

        it("Given locale", async () => {
            expect(commandRegistry.getCommandUsageString(
                commandRegistry.resolveCommandByPath("parent/test")!,
                "!",
                await translatorManager.getTranslator("ru")
            )).equal("!парент тест <арг> <арг2...>");
        });
    })
});
