import assert from "assert";
import { ApplicationCommandDataResolvable, ApplicationCommandOptionType, ApplicationCommandType, Client, Interaction, MessageFlags, MessageFlagsBitField, Snowflake } from "discord.js";
import { merge } from "lodash-es";
import sinon from "sinon";
import { setTimeout } from "timers/promises";
import { CommandRegistry } from "../CommandRegistry";
import { Command } from "../definitions";
import { CommandMessage } from "../messageTypes/CommandMessage";
import { InteractionHandler } from "./InteractionHandler";

describe(InteractionHandler.name, () => {
    function makeFakeCommand(path: string, {
        usableAsAppCommand: usableAsInteractionCommand,
        hasHandler,
        subcommands,
    }: {
        usableAsAppCommand?: false,
        hasHandler?: boolean,
        subcommands?: Command[],
    } = {}) {
        const key = path.split("/").reverse()[0];

        return {
            key,
            path,
            subcommands: new Map(subcommands?.map(command => [command.key, command])),
            handler: !subcommands?.length || hasHandler
                ? hasHandler !== false ? () => { } : null
                : null,

            interactionCommand: usableAsInteractionCommand !== false
                ? {
                    id: null
                }
                : undefined,

            nameTranslations: {
                "en-US": key
            },
            descriptionTranslations: {
                "en-US": key
            },
            args: {
                list: []
            },
            allowDMs: false,
            defaultMemberPermissions: []
        } as unknown as Command;
    }

    function createHandler(commands?: Command[]) {
        commands ??= [
            {
                path: "no-handler",
                translationPath: "no_handler",
                handler: null,
                subcommands: new Map()
            },
            {
                path: "all-arguments",
                translationPath: "all_arguments",
                args: {
                    list: [{
                        key: "argString",
                        type: ApplicationCommandOptionType.String
                    }, {
                        key: "argNumber",
                        type: ApplicationCommandOptionType.Number
                    }, {
                        key: "argInteger",
                        type: ApplicationCommandOptionType.Integer
                    }, {
                        key: "argBoolean",
                        type: ApplicationCommandOptionType.Boolean
                    }, {
                        key: "argChannel",
                        type: ApplicationCommandOptionType.Channel
                    }, {
                        key: "argUser",
                        type: ApplicationCommandOptionType.User
                    }, {
                        key: "argRole",
                        type: ApplicationCommandOptionType.Role
                    }]
                },
                handler: (_: any, {
                    argString,
                    argNumber,
                    argInteger,
                    argBoolean,
                    argChannel,
                    argUser,
                    argRole
                }: any) => `${argString} ${argNumber} ${argInteger} ${argBoolean} ${argChannel.id} ${argUser.id} ${argRole.id}`,
                subcommands: new Map()
            },
            {
                path: "last-arg-as-extras",
                translationPath: "last_arg_as_extras",
                args: {
                    list: [{
                        key: "firstArg",
                        name: "first-arg",
                        type: ApplicationCommandOptionType.String
                    }, {
                        key: "lastArg",
                        name: "last-arg",
                        type: ApplicationCommandOptionType.String
                    }],
                    lastArgAsExtras: true
                },
                handler: (_: any, {
                    firstArg,
                    lastArg
                }: any) => `${firstArg} ${lastArg.join(",")}`,
                subcommands: new Map()
            },
            {
                path: "normal",
                translationPath: "normal",
                args: { list: [] },
                handler: () => { },
                subcommands: new Map()
            },
            {
                path: "auto/slow",
                translationPath: "auto_slow",
                args: { list: [] },
                handler: async () => {
                    await setTimeout(1500)
                },
                subcommands: new Map()
            },
            {
                path: "auto/manually-replied",
                translationPath: "auto_manually_replied",
                args: { list: [] },
                handler: async (msg: CommandMessage) => {
                    await msg.reply({
                        content: "YAAY",
                        ephemeral: false
                    });
                },
                subcommands: new Map()
            },
            {
                path: "auto/rejected",
                translationPath: "auto_rejected",
                args: { list: [] },
                handler: async () => {
                    throw new Error();
                },
                subcommands: new Map()
            }
        ] as any;

        return new InteractionHandler(
            {
                application: {
                    commands: {
                        set: (commands: ApplicationCommandDataResolvable[]) =>
                            commands.map((command, i) => ({ ...command, id: i.toString() }))
                    }
                }
            } as unknown as Client,
            {
                translatorManager: {
                    fallbackLocale: "en-US",
                    getTranslator(_: any, base: string) {
                        // It always translates successfully
                        return {
                            translate: (...args: string[]) => `${base}: ${args.join(" ")}`
                        };
                    }
                },
                commandsById: new Map([
                    ["1", new Map(commands!.map(command => [command.path, command]))]
                ] as any) ,
                createContextMenuCommands: () => [{
                    id: "2",
                    handler: () => { }
                }],
                get commands() {
                    return new Map(commands!.map(command => [command.key, command]));
                },
                iterateCommands() {
                    return this.iterateSubcommands(this.commands);
                },
                *iterateSubcommands(map: Map<string, Command>) {
                    for (const command of map.values()) {
                        yield command;
                        yield* this.iterateSubcommands(command.subcommands);
                    }
                },
                resolveCommand(path: string) {
                    return commands?.find(command => command.path === path);
                },
                resolveCommandByLocalizedPath(path: string) {
                    return this.resolveCommand(path);
                }
            } as unknown as CommandRegistry,
            {}
        )
    }

    describe("Registration of interaction commands", () => {
        it("Filter away non slash commands", async () => {
            const commands = [
                makeFakeCommand("test", { usableAsAppCommand: false }),
                makeFakeCommand("test2")
            ];

            await createHandler(commands).init();

            assert(!commands[0].interactionCommand?.id && commands[1].interactionCommand?.id);
        });

        it("Subcommand handling", async () => {
            const commands = [
                makeFakeCommand("test", {
                    subcommands: [
                        makeFakeCommand("test/test", {
                            subcommands: [
                                makeFakeCommand("test/test/test"),
                                makeFakeCommand("test/test/test2")
                            ]
                        }),
                        makeFakeCommand("test/test2")
                    ]
                }),
                makeFakeCommand("test2", {
                    subcommands: [
                        makeFakeCommand("test2/test", {
                            subcommands: [
                                makeFakeCommand("test2/test/test"),
                                makeFakeCommand("test2/test/test2")
                            ]
                        }),
                        makeFakeCommand("test/test2")
                    ]
                })
            ];

            await createHandler(commands).init();

            assert(commands.every((command, i) => [
                command.interactionCommand?.id,
                command.subcommands.get("test")!.interactionCommand?.id,
                command.subcommands.get("test")!.subcommands.get("test")!.interactionCommand?.id,
                command.subcommands.get("test")!.subcommands.get("test2")!.interactionCommand?.id,
                command.subcommands.get("test2")!.interactionCommand?.id
            ].every(id => id === i.toString())))
        });

        it("Assign ids to context menu commands", async () => {
            const contextMenuCommands = [
                {
                    key: "test",
                    type: ApplicationCommandType.Message,
                    appCommandId: null,
                    appCommandData: {
                        name: "test",
                        type: ApplicationCommandType.Message
                    }
                },
                {
                    key: "test2",
                    type: ApplicationCommandType.User,
                    appCommandId: null,
                    appCommandData: {
                        name: "test2",
                        type: ApplicationCommandType.User
                    }
                }
            ];

            const handler = new InteractionHandler(
                {
                    application: {
                        commands: {
                            set: (commands: ApplicationCommandDataResolvable[]) =>
                                commands.map((command, i) => ({ ...command, id: i.toString() }))
                        }
                    }
                } as unknown as Client,
                {
                    translatorManager: {
                        fallbackLocale: "en-US"
                    },
                    commandsById: new Map(),
                    createContextMenuCommands: () => contextMenuCommands,
                    commands: new Map(),
                    *iterateCommands() { },
                    *iterateSubcommands() { },
                } as unknown as CommandRegistry,
                {}
            );

            await handler.init();

            assert(contextMenuCommands.every((command, i) => command.appCommandId === i.toString()));
        });

        describe("errors", () => { 
            it("Command with both subcommands and handler", async () => {
                const commands = [
                    makeFakeCommand("test", {
                        hasHandler: true,
                        subcommands: [
                            makeFakeCommand("test/test")
                        ]
                    })
                ];

                await assert.rejects(createHandler(commands).init(), /cannot have a handler/);
            });

            it("Command without either subcommands or handler", async () => {
                const commands = [
                    makeFakeCommand("test", {
                        hasHandler: false
                    })
                ];

                await assert.rejects(createHandler(commands).init(), /must have a handler/);
            });

            it("Too many nested commands", async () => {
                const commands = [
                    makeFakeCommand("test", {
                        subcommands: [
                            makeFakeCommand("test/test", {
                                subcommands: [
                                    makeFakeCommand("test/test/test", {
                                        subcommands: [
                                            makeFakeCommand("test/test/test/test")
                                        ]
                                    })
                                ]
                            })
                        ]
                    })
                ];

                await assert.rejects(createHandler(commands).init(), /depth was exceeded/);
            });
        });
    });

    describe("Interaction handling", () => {
        it("Ignore non-command interactions", async () => {
            const handler = await createHandler().init();
            await handler.handle({
                isCommand: () => false
            } as unknown as Interaction);
        });

        describe("Chat commands", () => {
            async function handleChatInteraction(path: string, overrides?: object) {
                const parts = path.split("/");

                const handler = await createHandler().init();
                const interaction = merge({
                    command: {
                        id: "1",
                        name: parts[0]
                    },
                    options: {
                        getSubcommandGroup: () => parts[1] ?? null,
                        getSubcommand: () => parts[2] ?? null,
                        getString: () => "string",
                        getNumber: () => 1,
                        getInteger: () => 2,
                        getBoolean: () => true,
                        getChannel: () => ({ id: 3 }),
                        getUser: () => ({ id: 4 }),
                        getRole: () => ({ id: 5 })
                    },
                    isCommand: () => true,
                    isChatInputCommand: () => true,
                    reply: sinon.stub()
                        .onFirstCall().resolves()
                        .onSecondCall().rejects(),
                    deferReply: sinon.stub()
                        .onFirstCall().resolves({
                        flags: new MessageFlagsBitField(MessageFlags.Loading)
                    })
                        .onSecondCall().rejects(),
                    followUp: sinon.stub()
                        .onFirstCall().resolves()
                        .onSecondCall().rejects(),
                }, overrides);
                await handler.handle(interaction as unknown as Interaction);
                return interaction;
            }

            describe("Respond with unknown command error", () => {
                it("No command in registry", async () => {
                    const interaction = await handleChatInteraction("unknown-command");
                    sinon.assert.calledOnceWithExactly(interaction.reply, {
                        content: "command_processor: errors.unknown_command",
                        ephemeral: true
                    });
                });

                it("No handler", async () => {
                    const interaction = await handleChatInteraction("no-handler");
                    sinon.assert.calledOnceWithExactly(interaction.reply, {
                        content: "command_processor: errors.unknown_command",
                        ephemeral: true
                    });
                });
            });

            describe("Argument parsing", () => {
                it("Argument types", async () => {
                    const interaction = await handleChatInteraction("all-arguments");
                    sinon.assert.calledOnceWithExactly(interaction.reply, {
                        content: "all_arguments: errors.string 1 2 true 3 4 5",
                        ephemeral: true,
                        fetchReply: true
                    });
                });

                it("Last arg as extras", async () => {
                    const interaction = await handleChatInteraction("last-arg-as-extras", {
                        options: {
                            getString: (name: string) => name === "first-arg" ? "1 2" : `3 4 "5 6"`
                        }
                    });
                    sinon.assert.calledOnceWithExactly(interaction.reply, {
                        content: "last_arg_as_extras: errors.1 2 3,4,5 6",
                        ephemeral: true,
                        fetchReply: true
                    })
                });
            });

            describe("Execute command", () => {
                it("Success", async () => {
                    const interaction = await handleChatInteraction("normal");
                    sinon.assert.calledOnceWithExactly(interaction.reply, {
                        content: "OK",
                        ephemeral: true,
                        fetchReply: true
                    });
                });

                it("Slow command", async function () {
                    this.slow(2000);

                    const interaction = await handleChatInteraction("auto/slow");
                    sinon.assert.calledOnceWithExactly(interaction.deferReply, {
                        ephemeral: true,
                        fetchReply: true
                    });
                    sinon.assert.calledOnceWithExactly(interaction.followUp, "OK");
                });

                it("Manually replied", async () => {
                    const interaction = await handleChatInteraction("auto/manually-replied");
                    sinon.assert.calledOnceWithExactly(interaction.reply, {
                        content: "YAAY",
                        ephemeral: false,
                        fetchReply: true
                    });
                });

                it("Threw or rejected", async () => {
                    const interaction = await handleChatInteraction("auto/rejected");
                    sinon.assert.calledOnceWithMatch(interaction.reply, {
                        content: sinon.match(/Error/),
                        ephemeral: true,
                        fetchReply: true
                    });
                });
            })
        });

        describe("Context menu commands", () => {
            async function handleContextMenuInteraction(id: Snowflake, overrides?: object) {
                const handler = await createHandler().init();
                const interaction = merge({
                    command: { id },
                    options: {
                    },
                    isCommand: () => true,
                    isChatInputCommand: () => false,
                    isContextMenuCommand: () => true,
                    reply: sinon.stub()
                }, overrides);
                await handler.handle(interaction as unknown as Interaction);
                return interaction;
            }

            it("No command in registry", async () => {
                const interaction = await handleContextMenuInteraction("2");
                sinon.assert.calledOnceWithExactly(interaction.reply, {
                    content: "command_processor: errors.unknown_command",
                    ephemeral: true
                });
            });
        });
    })
});
