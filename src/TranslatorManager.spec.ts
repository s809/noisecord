import { expect } from "chai";
import { CommandInteraction, Guild, Message, TextChannel, User } from "discord.js";
import sinon from "sinon";
import { testInitCheck } from "./testData/initCheck.js";
import { TranslationContextResolvable, TranslatorManager, TranslatorManagerOptions } from "./TranslatorManager.js";

const translationOptions: TranslatorManagerOptions = {
    translationFileDirectory: "./src/testData/translations/normal",
    defaultLocale: "en-US",
    getUserLocale: async () => "ru",
    getGuildLocale: async () => "ru",
};

const translationOptionsEmpty: TranslatorManagerOptions = {
    ...translationOptions,
    translationFileDirectory: "./src/testData/translations/empty"
};

describe("TranslatorManager", () => {
    let translatorManager: TranslatorManager;

    before(async () => {
        translatorManager = await new TranslatorManager(translationOptions).init();
    });

    testInitCheck(() => new TranslatorManager(translationOptions), [
        "fallbackTranslator"
    ], instance => instance.init());

    it("empty translation directory", async () => {
        const promise = new TranslatorManager(translationOptionsEmpty).init();
        await expect(promise).rejected;
    });

    it("#fallbackLocale", async () => {
        expect(translatorManager.fallbackLocale).equal("en-US");
    });

    it("#setLocaleRegexes", () => {
        expect(translatorManager.setLocaleRegexes).deep.equal({
            "en-US": /^en$/iu,
            "ru": /^ru$/iu
        });
    });

    describe("#getTranslator()", () => {
        async function validate(value: TranslationContextResolvable) {
            const found = await translatorManager.getTranslator(value);
            expect(found.localeString).equal("ru");
        }

        describe("by locale string", () => {
            it("valid", () => validate("ru"));
            it("invalid/missing", async () => {
                const found = await translatorManager.getTranslator("nani");
                expect(found.localeString).equal("en-US");
            });
        });

        it("by user", () => validate(sinon.createStubInstance(User)));
        it("by guild", () => validate(sinon.createStubInstance(Guild)));

        describe("by message", () => {
            function getMessage(isDMBased: boolean) {
                const message = sinon.createStubInstance(Message);
                sinon.stub(message, "channel").value(
                    sinon.createStubInstance(TextChannel, {
                        isDMBased
                    } as any)
                );
                message.author = sinon.createStubInstance(User);
                sinon.stub(message, "guild").value(!isDMBased
                    ? sinon.createStubInstance(Guild)
                    : null);
                return message;
            }

            it("guild", () => validate(getMessage(false)));
            it("user", () => validate(getMessage(true)));
        });

        describe("by command interaction", () => {
            function getInteraction(guild: boolean, ephemeral: boolean) {
                const commandInteraction = sinon.createStubInstance(CommandInteraction);
                commandInteraction.user = sinon.createStubInstance(User);
                commandInteraction.ephemeral = ephemeral;
                sinon.stub(commandInteraction, "guild").value(guild
                    ? sinon.createStubInstance(Guild)
                    : null);
                return commandInteraction;
            }

            describe("guild", () => {
                it("ephemeral", () => validate(getInteraction(true, true)));
                it("non-ephemeral", () => validate(getInteraction(true, false)));
            });
            
            describe("user", () => {
                it("ephemeral", () => validate(getInteraction(false, true)));
                it("non-ephemeral", () => validate(getInteraction(false, false)));
            });
        });
    });

    it("#getLocalizations()", () => {
        const localizations = translatorManager.getLocalizations("locale_string");
        expect(localizations).deep.equal({
            "en-US": "en-US",
            "ru": "ru"
        });
    });
});
