import assert from "assert";
import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { createCommand, CreateCommandUtil } from "./CreateCommandUtil";
import { CommandDefinition } from "./definitions";
import { TranslatorManager } from "./TranslatorManager";

describe("CreateCommandUtil", () => {
    let createCommandUtil: CreateCommandUtil;

    beforeEach(() => {
        createCommandUtil = new CreateCommandUtil({
            getLocalizations: _ => ({
                "en-US": "test",
                "ru": "test2"
            }),
            fallbackLocale: "en-US"
        } as TranslatorManager);
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

            createCommandUtil.setHeader(1, "Command config");
            createCommandUtil.fillInheritableOptions(partialCommand, inheritedOptions);

            createCommandUtil.setHeader(1, "Command translations");
            createCommandUtil.fillTranslations(partialCommand);

            createCommandUtil.setHeader(1, "Command arguments");
            createCommandUtil.fillArguments(partialCommand, definition.args);

            createCommandUtil.throwIfErrors();
        });
    });

    describe("errors", () => {
        describe(`#${CreateCommandUtil.prototype.fillInheritableOptions.name}`, () => {
            for (const inputs of [
                {
                    title: "Allowing a child to be usable as app command",
                    partialCommand: { usableAsAppCommand: true }, 
                    inheritedOptions: {},
                    check: /application command/
                },
                {
                    title: "Defining default member permissions in child",
                    partialCommand: { defaultMemberPermissions: [] },
                    inheritedOptions: {},
                    check: /default member permissions/
                },
                {
                    title: "Allowing DM permissions in child",
                    partialCommand: { allowDMs: true },
                    inheritedOptions: {},
                    check: /DM permission/
                },
                {
                    title: "Disabling owner-only flag in child",
                    partialCommand: { ownerOnly: false },
                    inheritedOptions: { ownerOnly: true },
                    check: /not owner-only/
                },
                {
                    title: "Conflicting properties (ownerOnly and usableAsAppCommand)",
                    partialCommand: { ownerOnly: false, usableAsAppCommand: true },
                    inheritedOptions: {},
                    check: /application command/
                }
            ] as const) {
                it(inputs.title, () => {
                    createCommandUtil.fillInheritableOptions({
                        conditions: [],
                        ...inputs.partialCommand
                    }, {
                        path: "test",
                        conditions: [],
                        usableAsAppCommand: true,
                        ownerOnly: false,
                        defaultMemberPermissions: [PermissionFlagsBits.UseApplicationCommands],
                        allowDMs: true,
                        ...inputs.inheritedOptions
                    });
                    assert.throws(() => createCommandUtil.throwIfErrors(), inputs.check);
                });
            }
        });

        describe(`#${CreateCommandUtil.prototype.fillTranslations.name}`, () => {
            for (const inputs of [
                {
                    title: "No matching name",
                    name: {
                        "en-US": "test"
                    },
                    description: {
                        "en-US": "test",
                        "ru": "test2"
                    },
                    check: /command name.*generated: 1/s
                },
                {
                    title: "No matching description",
                    name: {
                        "en-US": "test",
                        "ru": "test2"
                    },
                    description: {
                        "en-US": "test"
                    },
                    check: /command description.*generated: 1/s
                },
                {
                    title: "Default locale is missing",
                    name: {},
                    description: {},
                    check: /default locale.*generated: 1/s
                },
                {
                    title: "Invalid name",
                    name: {
                        "en-US": "test test"
                    },
                    description: {
                        "en-US": "test"
                    },
                    check: /does not match.*generated: 1/s
                }
            ] as const) {
                it(inputs.title, () => {
                    const createCommandUtil = new CreateCommandUtil({
                        getLocalizations: translationPath => {
                            switch (translationPath) {
                                case "commands.path_to_command.name":
                                    return inputs.name;
                                case "commands.path_to_command.description":
                                    return inputs.description;
                                default:
                                    return {};
                            }
                        },
                        fallbackLocale: "en-US"
                    } as TranslatorManager);

                    createCommandUtil.fillTranslations({ path: "path/to/command" });

                    assert.throws(() => createCommandUtil.throwIfErrors(), inputs.check);
                });
            }
        });

        describe(`#${CreateCommandUtil.prototype.fillArguments.name}`, () => {
            for (const inputs of [
                {
                    title: "Missing argument name",
                    missingTranslation: "name",
                    check: /argument name/s
                },
                {
                    title: "Missing argument description",
                    missingTranslation: "description",
                    check: /argument description/s
                },
                {
                    title: "Missing choice name",
                    missingTranslation: "choices",
                    check: /choice name/s
                },
                {
                    title: "Optional argument not after all required",
                    args: [{
                        required: false
                    }, {
                        required: true
                    }],
                    check: /after all required/s
                },
                {
                    title: "Extras arg is not last",
                    args: [{
                        isExtras: true
                    }, {
                    }],
                    check: /must be the last/s
                },
                {
                    title: "Extras argument not of a string type",
                    args: [{
                        type: ApplicationCommandOptionType.Number,
                        isExtras: true
                    }],
                    check: /must be of a string type/s
                },
                {
                    title: "Extras argument is optional",
                    args: [{
                        isExtras: true,
                        required: false
                    }],
                    check: /cannot be optional/s
                },
            ] as const) {
                it(inputs.title, () => {
                    const createCommandUtil = new CreateCommandUtil({
                        getLocalizations: translationPath => ({
                            ...translationPath.split(".")[4] !== inputs.missingTranslation
                                && { "en-US": "test" }
                        }),
                        fallbackLocale: "en-US"
                    } as TranslatorManager);

                    const argsFiller = {
                        key: "argKey",
                        type: ApplicationCommandOptionType.String,
                        choices: [{
                            key: "choiceKey",
                            value: "choice"
                        }] as any
                    } as const;

                    createCommandUtil.fillArguments({
                        translationPath: "commands.path_to_command",
                        nameTranslations: { "en-US": "test" }
                    }, inputs.args?.map(arg => ({ 
                        ...argsFiller, ...arg
                    })) ?? [argsFiller]);

                    assert.throws(() => createCommandUtil.throwIfErrors(), inputs.check);
                });
            }
        });
    });
});
