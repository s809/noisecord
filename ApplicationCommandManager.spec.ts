import assert from "assert";
import { ApplicationCommandDataResolvable, ApplicationCommandType, Client } from "discord.js";
import { ApplicationCommandManager } from "./ApplicationCommandManager";
import { CommandRegistry } from "./CommandRegistry";
import { Command } from "./definitions";

describe("ApplicationCommandManager", () => {
    function makeFakeCommand(path: string, {
        usableAsAppCommand,
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
            usableAsAppCommand: usableAsAppCommand ?? true,
            subcommands: new Map(subcommands?.map(command => [command.key, command])),
            handler: !subcommands?.length || hasHandler
                ? hasHandler !== false ? () => { } : null
                : null,

            appCommandId: null,

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

    function createAndInitCommandManager(commands: Command[]) {
        return new ApplicationCommandManager({
            translatorManager: {
                fallbackLocale: "en-US"
            },
            createContextMenuCommands: () => [],
            get commands() {
                return new Map(commands.map(command => [command.key, command]));
            },
            iterateCommands() {
                return this.iterateSubcommands(this.commands);
            },
            *iterateSubcommands(map: Map<string, Command>) {
                for (const command of map.values()) {
                    yield command;
                    yield* this.iterateSubcommands(command.subcommands);
                }
            }
        } as unknown as CommandRegistry).init({
            application: {
                commands: {
                    set: (commands: ApplicationCommandDataResolvable[]) =>
                        commands.map((command, i) => ({ ...command, id: i.toString() }))
                }
            }
        } as unknown as Client);
    }

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

        const manager = new ApplicationCommandManager({
            translatorManager: {
                fallbackLocale: "en-US"
            },
            createContextMenuCommands: () => contextMenuCommands,
            commands: new Map(),
            *iterateCommands() { },
            *iterateSubcommands() { },
        } as unknown as CommandRegistry);

        await manager.init({
            application: {
                commands: {
                    set: (commands: ApplicationCommandDataResolvable[]) =>
                        commands.map((command, i) => ({ ...command, id: i.toString() }))
                }
            }
        } as unknown as Client);

        assert(contextMenuCommands.every((command, i) => command.appCommandId === i.toString()));
    });

    it("Filter away non slash commands", async () => {
        const commands = [
            makeFakeCommand("test", { usableAsAppCommand: false }),
            makeFakeCommand("test2")
        ];

        await createAndInitCommandManager(commands);

        assert(!commands[0].appCommandId && commands[1].appCommandId);
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
                    makeFakeCommand("test/test", {
                        subcommands: [
                            makeFakeCommand("test/test/test"),
                            makeFakeCommand("test/test/test2")
                        ]
                    }),
                    makeFakeCommand("test/test2")
                ]
            })
        ];

        await createAndInitCommandManager(commands);

        assert(commands.every((command, i) => [
            command.appCommandId,
            command.subcommands.get("test")!.appCommandId,
            command.subcommands.get("test")!.subcommands.get("test")!.appCommandId,
            command.subcommands.get("test")!.subcommands.get("test2")!.appCommandId,
            command.subcommands.get("test2")!.appCommandId
        ].every(id => id === i.toString())))
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

            await assert.rejects(createAndInitCommandManager(commands), /cannot have a handler/);
        });

        it("Command without either subcommands or handler", async () => {
            const commands = [
                makeFakeCommand("test", {
                    hasHandler: false
                })
            ];

            await assert.rejects(createAndInitCommandManager(commands), /must have a handler/);
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

            await assert.rejects(createAndInitCommandManager(commands), /depth was exceeded/);
        });
    });
});
