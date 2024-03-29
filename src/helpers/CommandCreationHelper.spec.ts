import { expect } from "chai";
import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { CommandCreationHelper } from "./CommandCreationHelper.js";
import { TranslatorManager } from "../translations/TranslatorManager.js";
import { CommandDefinition } from "../interfaces/Command.js";

describe("CommandCreationHelper", () => {
    let commandCreationHelper: CommandCreationHelper;

    beforeEach(() => {
        commandCreationHelper = new CommandCreationHelper({
            getLocalizations: _ => ({
                "en-US": "test",
                "ru": "test2"
            }),
            fallbackLocale: "en-US"
        } as TranslatorManager, true);
    });

    describe("no errors", () => {
        it("no action", () => {
            commandCreationHelper.throwIfErrors();
        });

        it("create command", () => {
            const definition: CommandDefinition = {
                key: "test"
            };

            const partialCommand = commandCreationHelper.createCommand(definition);
            const inheritedOptions = undefined;

            partialCommand.path = partialCommand.key;

            commandCreationHelper.setHeader(1, "Command config");
            commandCreationHelper.fillInheritableOptions(partialCommand, inheritedOptions);

            commandCreationHelper.setHeader(1, "Command translations");
            commandCreationHelper.fillTranslations(partialCommand, "commands.test");

            commandCreationHelper.setHeader(1, "Command arguments");
            commandCreationHelper.fillArguments(partialCommand, definition.args);

            commandCreationHelper.throwIfErrors();
        });
    });

    describe("errors", () => {
        describe(`#${CommandCreationHelper.prototype.fillInheritableOptions.name}`, () => {
            for (const inputs of [
                {
                    title: "Defining default member permissions in child",
                    partialCommand: { defaultMemberPermissions: [] },
                    inheritedOptions: {},
                    check: /default member permissions/
                },
                {
                    title: "Changing DM permission in child",
                    partialCommand: { allowDMs: true },
                    inheritedOptions: { allowDMs: false },
                    check: /DM permission/
                },
                {
                    title: "Disabling owner-only flag in child",
                    partialCommand: { ownerOnly: false },
                    inheritedOptions: { ownerOnly: true },
                    check: /not owner-only/
                }
            ] as const) {
                it(inputs.title, () => {
                    commandCreationHelper.fillInheritableOptions({
                        conditions: [],
                        ...inputs.partialCommand
                    }, {
                        path: "test",
                        conditions: [],
                        interactionCommand: null,
                        ownerOnly: false,
                        defaultMemberPermissions: [PermissionFlagsBits.UseApplicationCommands],
                        allowDMs: true,
                        ...inputs.inheritedOptions
                    });
                    expect(() => commandCreationHelper.throwIfErrors()).throws(inputs.check);
                });
            }
        });

        describe(`#${CommandCreationHelper.prototype.fillTranslations.name}`, () => {
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
                    const commandCreationHelper = new CommandCreationHelper({
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
                    } as TranslatorManager, true);

                    commandCreationHelper.fillTranslations({ path: "path/to/command" }, "commands.path_to_command");

                    expect(() => commandCreationHelper.throwIfErrors()).throws(inputs.check);
                });
            }

            for (const inputs of [
                {
                    title: "No matching name",
                    name: {
                        "en-US": "test"
                    },
                    description: {
                        "en-US": "test",
                        "ru": "test2"
                    }
                },
                {
                    title: "No matching description",
                    name: {
                        "en-US": "test",
                        "ru": "test2"
                    },
                    description: {
                        "en-US": "test"
                    }
                },
                {
                    title: "Default locale is missing",
                    name: {},
                    description: {}
                }
            ] as const) {
                it(inputs.title, () => {
                    const commandCreationHelper = new CommandCreationHelper({
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
                    } as TranslatorManager, false);

                    commandCreationHelper.fillTranslations({ path: "path/to/command" }, "commands.path_to_command");
                    commandCreationHelper.throwIfErrors();
                });
            }
        });

        describe(`#${CommandCreationHelper.prototype.fillArguments.name}`, () => {
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
                        extras: true
                    }, {
                    }],
                    check: /must be the last/s
                },
                {
                    title: "Extras argument not of a string type",
                    args: [{
                        type: ApplicationCommandOptionType.Number,
                        extras: true
                    }],
                    check: /must be of a string type/s
                },
                {
                    title: "Raw arg is not last",
                    args: [{
                        raw: true
                    }, {
                    }],
                    check: /must be the last/s
                },
                {
                    title: "Raw argument not of a string type",
                    args: [{
                        type: ApplicationCommandOptionType.Number,
                        raw: true
                    }],
                    check: /must be of a string type/s
                }
            ] as const) {
                it(inputs.title, () => {
                    const commandCreationHelper = new CommandCreationHelper({
                        getLocalizations: translationPath => ({
                            ...translationPath.split(".")[4] !== inputs.missingTranslation
                                && { "en-US": "test" }
                        }),
                        fallbackLocale: "en-US"
                    } as TranslatorManager, true);

                    const argsFiller = {
                        key: "argKey",
                        type: ApplicationCommandOptionType.String,
                        choices: [{
                            key: "choiceKey",
                            value: "choice"
                        }] as any
                    } as const;

                    commandCreationHelper.fillArguments({
                        translationPath: "commands.path_to_command",
                        nameTranslations: { "en-US": "test" }
                    }, inputs.args?.map(arg => ({ 
                        ...argsFiller, ...arg
                    })) ?? [argsFiller]);

                    expect(() => commandCreationHelper.throwIfErrors()).throws(inputs.check);
                });
            }
        });
    });
});
