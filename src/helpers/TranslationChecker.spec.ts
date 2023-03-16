import { expect } from "chai";
import { TranslatorManager } from "../TranslatorManager.js";
import { TranslationChecker } from "./TranslationChecker.js";

describe(TranslationChecker.name, () => {
    let translationManager: TranslatorManager;
    let translationChecker: TranslationChecker;

    beforeEach(async () => {
        translationManager = await new TranslatorManager({
            translationFileDirectory: "./src/testData/translations/normal",
            defaultLocale: "en-US",
            getUserLocale: async () => "en-US",
            getGuildLocale: async () => "en-US",
        }).init();
        translationChecker = new TranslationChecker();
    });

    describe("Return correct structure", () => {
        it("Without prefix", () => {
            expect(translationChecker.checkTranslations({
                "translation_checker.test.default_only": false,
                "translation_checker.test.all": true,
            } as const)).containSubset({
                translation_checker: {
                    test: {
                        default_only: {
                            path: "translation_checker.test.default_only"
                        },
                        all: {
                            path: "translation_checker.test.all"
                        }
                    }
                }
            });

            translationChecker.throwIfErrors();
        });
        
        it("With prefix", () => {
            expect(translationChecker.checkTranslations({
                "test.default_only": false,
                "test.all": true,
            } as const, "translation_checker")).containSubset({
                test: {
                    default_only: {
                        path: "translation_checker.test.default_only"
                    },
                    all: {
                        path: "translation_checker.test.all"
                    }
                }
            });

            translationChecker.throwIfErrors();
        });
    });

    it("Throw immediately on empty path", () => {
        expect(() => translationChecker.checkTranslations({
            "": false,
        } as const)).throw("Path cannot be empty.");
    });

    describe("Add error", () => {

        it("Default translation is missing", () => {
            translationChecker.checkTranslations({
                "translation_checker.test.default_only_missing": false,
            } as const);

            expect(() => translationChecker.runChecks(translationManager)).throw("Translation of translation_checker.test.default_only_missing is missing in default locale (en-US).");
        });

        it("Translation is missing with all locales check", () => {
            translationChecker.checkTranslations({
                "translation_checker.test.default_only": true,
            } as const);

            expect(() => translationChecker.runChecks(translationManager)).throw("Translation of translation_checker.test.default_only is missing in locales: ru.");
        });
    });
});
