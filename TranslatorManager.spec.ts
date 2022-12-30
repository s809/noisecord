import assert from "assert";
import { CommandInteraction, Guild, Message, TextChannel, User } from "discord.js";
import sinon from "sinon";
import { NameOrContext, TranslatorManager, TranslatorManagerOptions } from "./TranslatorManager";

const translationOptions: TranslatorManagerOptions = {
    translationFileDirectory: "./testData/translations/normal",
    defaultLocale: "en-US",
    getUserLanguage: async () => "ru",
    getGuildLanguage: async () => "ru",
};

const translationOptionsEmpty: TranslatorManagerOptions = {
    ...translationOptions,
    translationFileDirectory: "./testData/translations/empty"
};

describe("TranslatorManager", () => {
    let translatorManager: TranslatorManager;

    before(async () => {
        translatorManager = await new TranslatorManager(translationOptions).init();
    });

    it("empty translation directory", async () => {
        const promise = new TranslatorManager(translationOptionsEmpty).init();
        await assert.rejects(promise);
    });

    it("#fallbackLocale", async () => {
        assert(translatorManager.fallbackLocale === "en-US");
    });

    describe("#getTranslator()", () => {
        async function validate(value: NameOrContext) {
            const found = await translatorManager.getTranslator(value);
            assert(found.localeString === "ru");
        }

        describe("by locale string", () => {
            it("valid", () => validate("ru"));
            it("invalid/missing", async () => {
                const found = await translatorManager.getTranslator("nani");
                assert(found.localeString === "en-US");
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
        assert.deepStrictEqual(localizations, {
            "en-US": "en-US",
            "ru": "ru"
        });
    });
});
