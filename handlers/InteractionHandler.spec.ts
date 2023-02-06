import assert from "assert";
import { ApplicationCommandDataResolvable, ApplicationCommandType, Client, Interaction, MessageFlags, MessageFlagsBitField, Snowflake } from "discord.js";
import { merge } from "lodash-es";
import sinon from "sinon";
import { CommandRegistry } from "../CommandRegistry";
import { InteractionHandler } from "./InteractionHandler";
import { makeFakeCommand, createHandler } from "./testData/util";

describe(InteractionHandler.name, () => {
    describe("Registration of interaction commands", () => {
        it("Filter away non slash commands", async () => {
            const commands = [
                makeFakeCommand("test", { usableAsAppCommand: false }),
                makeFakeCommand("test2")
            ];

            await createHandler(InteractionHandler, commands).init();

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

            await createHandler(InteractionHandler, commands).init();

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
                    on: sinon.stub(),
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

                await assert.rejects(createHandler(InteractionHandler, commands).init(), /cannot have a handler/);
            });

            it("Command without either subcommands or handler", async () => {
                const commands = [
                    makeFakeCommand("test", {
                        hasHandler: false
                    })
                ];

                await assert.rejects(createHandler(InteractionHandler, commands).init(), /must have a handler/);
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

                await assert.rejects(createHandler(InteractionHandler, commands).init(), /depth was exceeded/);
            });
        });
    });

    describe("Interaction handling", () => {
        it("Ignore non-command interactions", async () => {
            const handler = await createHandler(InteractionHandler).init();
            await handler.handle({
                isCommand: () => false
            } as unknown as Interaction);
        });

        describe("Chat commands", () => {
            async function handleChatInteraction(path: string, overrides?: object) {
                const parts = path.split("/");

                const handler = await createHandler(InteractionHandler).init();
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
                        .onFirstCall().resolves({
                            flags: new MessageFlagsBitField()
                        })
                        .onSecondCall().rejects(),
                    deferReply: sinon.stub()
                        .onFirstCall().resolves({
                            flags: new MessageFlagsBitField(MessageFlags.Loading)
                        })
                        .onSecondCall().rejects(),
                    followUp: sinon.stub()
                        .onFirstCall().resolves({
                            flags: new MessageFlagsBitField()
                        })
                        .onSecondCall().rejects(),
                    editReply: sinon.stub()
                        .onFirstCall().resolves({
                            flags: new MessageFlagsBitField()
                        })
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
                const handler = await createHandler(InteractionHandler).init();
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
