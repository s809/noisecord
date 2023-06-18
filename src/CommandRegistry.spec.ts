import { expect } from "chai";
import { CommandRegistry } from "./CommandRegistry.js";
import { TranslatorManager } from "./translations/TranslatorManager.js";

describe("CommandRegistry", () => {
    let translatorManager: TranslatorManager;
    let commandRegistry: CommandRegistry;

    beforeEach(async () => { 
        translatorManager = await new TranslatorManager({
            translationFileDirectory: "./src/testData/translations/normal",
            defaultLocale: "en-US",
            getUserLocale: async () => "ru",
            getGuildLocale: async () => "ru",
        }).init();
        commandRegistry = await new CommandRegistry({
            commandModuleDirectory: "./src/testData/commands/normal",
            contextMenuModuleDirectory: "./src/testData/contextMenuCommands/normal"
        }, translatorManager).createCommands();
    });

    it("normal", () => commandRegistry.createCommands());

    describe("errors", async function () {
        const translatorManager = await new TranslatorManager({
            translationFileDirectory: "./src/testData/translations/normal",
            defaultLocale: "en-US",
            getUserLocale: async () => "ru",
            getGuildLocale: async () => "ru",
        }).init();


        it("Don't require command translations", async function () {
            this.timeout(5000);

            const promise = new CommandRegistry({
                commandModuleDirectory: "./src/testData/commands/errors",
                contextMenuModuleDirectory: "./src/testData/contextMenuCommands/normal"
            }, translatorManager).createCommands();

            await expect(promise).rejectedWith("Errors generated: 4");
        })

        it("Require command translations", async function () {
            this.timeout(5000);

            const promise = new CommandRegistry({
                commandModuleDirectory: "./src/testData/commands/errors",
                contextMenuModuleDirectory: "./src/testData/contextMenuCommands/normal",
                requireCommandTranslations: true
            }, translatorManager).createCommands();

            await expect(promise).rejectedWith("Errors generated: 7");
        })
    });

    describe("Context menu command creation", () => {
        it("No command directory", async () => {
            commandRegistry = new CommandRegistry({
                commandModuleDirectory: "./src/testData/commands/normal",
                contextMenuModuleDirectory: undefined
            }, translatorManager);
            expect(commandRegistry.contextMenuCommands).empty;
        });

        it("Return correct values", async () => {
            expect(commandRegistry.contextMenuCommands).containSubset([
                {
                    key: "cm-message",
                    type: 3,
                    allowDMs: true,
                    appCommandId: null,
                    appCommandData: {
                        type: 3,
                        name: "cm-message",
                        nameLocalizations: {
                            "en-US": "cm-message"
                        },
                        dmPermission: true
                    }
                },
                {
                    key: "cm-user",
                    type: 2,
                    allowDMs: true,
                    appCommandId: null,
                    appCommandData: {
                        type: 2,
                        name: "cm-user",
                        nameLocalizations: {
                            "en-US": "cm-user"
                        },
                        dmPermission: true
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
