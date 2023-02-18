import { expect } from "chai";
import { ApplicationCommandDataResolvable, ApplicationCommandType, Client, Interaction, MessageFlags, MessageFlagsBitField, Snowflake } from "discord.js";
import { merge } from "lodash-es";
import sinon from "sinon";
import { CommandRegistry } from "../CommandRegistry";
import { ContextMenuCommand } from "../definitions";
import { InteractionHandler } from "./InteractionHandler";
import { makeFakeCommand, createHandler, IdConstants } from "./testData/util";

describe(InteractionHandler.name, () => {
    describe("Registration of interaction commands", () => {
        it("Filter away non slash commands", async () => {
            const commands = [
                makeFakeCommand("test", { usableAsAppCommand: false }),
                makeFakeCommand("test2")
            ];

            await createHandler(InteractionHandler, commands).init();

            expect(commands[0].interactionCommand).null;
            expect(commands[1].interactionCommand).exist;
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

            for (const [i, command] of commands.entries()) {
                expect([
                    command.interactionCommand?.id,
                    command.subcommands.get("test")!.interactionCommand?.id,
                    command.subcommands.get("test")!.subcommands.get("test")!.interactionCommand?.id,
                    command.subcommands.get("test")!.subcommands.get("test2")!.interactionCommand?.id,
                    command.subcommands.get("test2")!.interactionCommand?.id
                ]).deep.equal(new Array(5).fill(i.toString()));
            }
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

            for (const [i, command] of contextMenuCommands.entries())
                expect(command.appCommandId).equal(i.toString());
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

                expect(createHandler(InteractionHandler, commands).init()).rejectedWith(/cannot have a handler/);
            });

            it("Command without either subcommands or handler", async () => {
                const commands = [
                    makeFakeCommand("test", {
                        hasHandler: false
                    })
                ];

                expect(createHandler(InteractionHandler, commands).init()).rejectedWith(/must have a handler/);
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

                expect(createHandler(InteractionHandler, commands).init()).rejectedWith(/depth was exceeded/);
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
                let deferred = false;
                let replied = false;
                const interaction = merge({
                    command: {
                        id: IdConstants.ChatInteractionCommands,
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
                    get deferred() {
                        return deferred;
                    },
                    get replied() {
                        return replied;
                    },
                    reply: sinon.stub()
                        .onFirstCall().callsFake(() => replied = true).resolves({
                            flags: new MessageFlagsBitField()
                        })
                        .onSecondCall().rejects(),
                    deferReply: sinon.stub()
                        .onFirstCall().callsFake(() => deferred = true).resolves({
                            flags: new MessageFlagsBitField(MessageFlags.Loading)
                        })
                        .onSecondCall().rejects(),
                    fetchReply: () => ({
                        flags: {
                            has: (flag: MessageFlags) => flag === MessageFlags.Loading && deferred
                        }
                    }),
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
                    expect(interaction.reply).calledOnceWithExactly({
                        content: "command_processor: errors.unknown_command",
                        ephemeral: true
                    });
                });

                it("No handler", async () => {
                    const interaction = await handleChatInteraction("no-handler");
                    expect(interaction.reply).calledOnceWithExactly({
                        content: "command_processor: errors.unknown_command",
                        ephemeral: true
                    });
                });
            });

            describe("Argument parsing", () => {
                it("Argument types", async () => {
                    const interaction = await handleChatInteraction("all-arguments");
                    expect(interaction.reply).calledOnceWithExactly({
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
                    expect(interaction.reply).calledOnceWithExactly({
                        content: "last_arg_as_extras: errors.1 2 3,4,5 6",
                        ephemeral: true,
                        fetchReply: true
                    })
                });
            });

            describe("Execute command", () => {
                it("Success", async () => {
                    const interaction = await handleChatInteraction("normal");
                    expect(interaction.reply).calledOnceWithExactly({
                        content: "OK",
                        ephemeral: true,
                        fetchReply: true
                    });
                });

                it("Slow command", async function () {
                    this.slow(2000);

                    const interaction = await handleChatInteraction("slow");
                    expect(interaction.deferReply).calledOnceWithExactly({
                        ephemeral: true,
                        fetchReply: true
                    });
                    expect(interaction.followUp).calledOnceWithExactly({
                        content: "OK",
                        ephemeral: true
                    });
                });

                it("Manually replied", async () => {
                    const interaction = await handleChatInteraction("auto/manually-replied");
                    expect(interaction.reply).calledOnceWithExactly({
                        content: "YAAY",
                        ephemeral: false,
                        fetchReply: true
                    });
                });

                it("Threw or rejected", async () => {
                    const interaction = await handleChatInteraction("auto/rejected");
                    expect(interaction.reply).calledOnceWithExactly({
                        content: sinon.match(/Error/),
                        ephemeral: true,
                        fetchReply: true
                    });
                });
            });
        });

        describe("Context menu commands", () => {
            async function handleContextMenuInteraction(key: string, overrides?: object) {
                const handler = await createHandler(InteractionHandler).init();

                const command = [...((handler as any).commandRegistry as CommandRegistry).commandsById.values()]
                    .find(c => (c as ContextMenuCommand).key === key) as ContextMenuCommand | undefined;
                
                let deferred = false;
                let replied = false;
                const interaction = merge({
                    command: {
                        id: command?.appCommandId ?? "1000"
                    },
                    options: {
                    },
                    isCommand: () => true,
                    isChatInputCommand: () => false,
                    isContextMenuCommand: () => true,
                    get deferred() {
                        return deferred;
                    },
                    get replied() {
                        return replied;
                    },
                    reply: sinon.stub()
                        .onFirstCall().callsFake(() => replied = true).resolves({
                            flags: new MessageFlagsBitField()
                        })
                        .onSecondCall().rejects(),
                    deferReply: sinon.stub()
                        .onFirstCall().callsFake(() => deferred = true).resolves({
                            flags: new MessageFlagsBitField(MessageFlags.Loading)
                        })
                        .onSecondCall().rejects(),
                    fetchReply: () => ({
                        flags: {
                            has: (flag: MessageFlags) => flag === MessageFlags.Loading && deferred
                        }
                    }),
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

            it("No command in registry", async () => {
                const interaction = await handleContextMenuInteraction("cmnone");
                expect(interaction.reply).calledOnceWithExactly({
                    content: "command_processor: errors.unknown_command",
                    ephemeral: true
                });
            });

            describe("Execute command", () => {
                it("Success", async () => {
                    const interaction = await handleContextMenuInteraction("cm-normal");
                    expect(interaction.reply).calledOnceWithExactly({
                        content: "OK",
                        ephemeral: true
                    });
                });

                it("Slow command", async function () {
                    this.slow(2000);

                    const interaction = await handleContextMenuInteraction("cm-slow");
                    expect(interaction.deferReply).calledOnceWithExactly({
                        ephemeral: true
                    });
                    expect(interaction.followUp).calledOnceWithExactly({
                        content: 'OK',
                        ephemeral: true
                    });
                });

                it("Manually replied", async () => {
                    const interaction = await handleContextMenuInteraction("cm-manually-replied");
                    expect(interaction.reply).calledOnceWithExactly({
                        content: "YAAY",
                        ephemeral: false
                    });
                });

                it("Threw or rejected", async () => {
                    const interaction = await handleContextMenuInteraction("cm-rejected");
                    expect(interaction.reply).calledOnceWithExactly({
                        content: sinon.match(/Error/),
                        ephemeral: true,
                        fetchReply: true
                    });
                });
            });
        });
    })
});
