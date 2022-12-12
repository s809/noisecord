import sinon from "sinon";
import { createCommand, CreateCommandUtil } from "./CreateCommandUtil";
import { CommandDefinition } from "./definitions";
import { TranslatorManager } from "./TranslatorManager";

describe("CreateCommandUtil", () => {
    let createCommandUtil: CreateCommandUtil;

    beforeEach(() => {
        const translatorManager = sinon.createStubInstance(TranslatorManager, {
            getLocalizations: {
                "en-US": "test-shit",
                "ru": "test-shit2"
            }
        });
        sinon.stub(translatorManager, "fallbackLocale").value("en-US");

        createCommandUtil = new CreateCommandUtil(translatorManager);
        createCommandUtil.setHeader(0, "(vibe check)");
    });

    describe("no errors", () => {
        it("no action", () => {
            createCommandUtil.throwIfErrors();
        });

        it("create command", () => {
            const definition: CommandDefinition = {
                key: "test"
            };

            const partialCommand = createCommand(definition);
            const inheritedOptions = undefined;

            partialCommand.path = partialCommand.key;
            createCommandUtil.setHeader(0, partialCommand.path!)

            createCommandUtil.setHeader(1, "Command config");
            createCommandUtil.fillInheritableOptions(partialCommand, inheritedOptions);

            createCommandUtil.setHeader(1, "Command translations");
            createCommandUtil.fillTranslations(partialCommand);

            createCommandUtil.setHeader(1, "Command arguments");
            createCommandUtil.fillArguments(partialCommand, definition.args);

            createCommandUtil.throwIfErrors();
        });
    })
});
