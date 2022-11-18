import assert from "assert";
import { Guild, User } from "discord.js";
import sinon from "sinon";
import { TranslatorManager, TranslatorManagerOptions } from "./TranslatorManager";

const translationOptions: TranslatorManagerOptions = {
    translationFileDirectory: "./testData/normal/translations",
    defaultLocale: "en-US",
    getUserLanguage: async () => "en-US",
    getGuildLanguage: async () => "en-US",
};

const translationOptionsEmpty: TranslatorManagerOptions = {
    translationFileDirectory: "./testData/empty/translations",
    defaultLocale: "en-US",
    getUserLanguage: async () => "en-US",
    getGuildLanguage: async () => "en-US",
};

describe("TranslatorManager", () => {
    let translatorManager: TranslatorManager;

    before(async () => {
        translatorManager = await new TranslatorManager(translationOptions).init();
    });

    it("empty translation directory", async () => {
        const promise = new TranslatorManager(translationOptionsEmpty).init();
        assert.rejects(promise);
    });

    it("#fallbackLocale", async () => {
        assert(translatorManager.fallbackLocale === "en-US");
    });

    it("#getTranslator()", async () => {
        let found = await translatorManager.getTranslator("en-US");
        assert(found.localeString === "en-US");

        const user = sinon.createStubInstance(User);
        found = await translatorManager.getTranslator(user);
        assert(found.localeString === "en-US");

        const guild = sinon.createStubInstance(Guild);
        found = await translatorManager.getTranslator(guild);
        assert(found.localeString === "en-US");
    });
});
