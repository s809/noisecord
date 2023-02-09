import { ApplicationCommandOptionType, ApplicationCommandDataResolvable, Client, Collection, ApplicationCommandPermissionType, Snowflake } from "discord.js";
import { CommandRegistry } from "../../CommandRegistry";
import { Command } from "../../definitions";
import { CommandMessage } from "../../messageTypes/CommandMessage";
import { setTimeout } from "timers/promises";
import sinon from "sinon";
import { merge } from "lodash-es";

enum _IdConstants {
    GuildNone,
    Guild1,
    Guild2,

    ChannelNone,
    Channel1,

    UserBotOwner,
    UserNone,
    User1,

    PermissionOverridesNone,
    PermissionOverridesRoleBasic,
    PermissionOverridesRoleStacking,
    PermissionOverridesUserBasic,
    PermissionOverridesUserOverrideRole,
    PermissionOverridesChannelBasic,
    PermissionOverridesChannelAllChannels,
    PermissionOverridesChannelOverrideAllChannels,
    PermissionOverridesChannelOverrideRole,
    PermissionOverridesChannelOverrideUser,
    PermissionOverridesAllowOwner,

    Role1,
    Role2,
    Role3,
};
export const IdConstants: {
    [K in keyof typeof _IdConstants]: `${typeof _IdConstants[K]}`;
} = Object.fromEntries(
    Object.entries(_IdConstants).map(([key, value]) => [key, value.toString()])
) as any;

export function makeFakeCommand(path: string, {
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

export function createHandler<T extends new (...args: any) => InstanceType<T>>(constructor: T, commands?: Command[], options: ConstructorParameters<T>[2] = {}) {
    // Do not use path slashes along with interaction allowing commands
    commands ??= [
        ["normal", {}],
        ["no-handler", {
            handler: null,
            subcommands: new Map([
                ["fake", {
                    handler: () => { },
                    subcommands: new Map()
                } as any]
            ])
        }],
        ["all-arguments", {
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
            }: any) => `${argString} ${argNumber} ${argInteger} ${argBoolean} ${argChannel.id} ${argUser.id} ${argRole.id}`
        }],
        ["last-arg-as-extras", {
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
            }: any) => `${firstArg} ${lastArg.join(",")}`
        }],
        ["auto/slow", {
            handler: async () => {
                await setTimeout(1500)
            }
        }],
        ["auto/manually-replied", {
            handler: async (msg: CommandMessage) => {
                await msg.reply({
                    content: "YAAY",
                    ephemeral: false
                });
            }
        }],
        ["auto/rejected", {
            handler: async () => {
                throw new Error();
            }
        }],
        ["owner-only", {
            ownerOnly: true
        }],
        ["dm-no", {
            allowDMs: false
        }],
        ["permission-overrides-none", {
            interactionCommand: {
                id: IdConstants.PermissionOverridesNone
            }
        }],
        ["permission-overrides-role-basic", {
            interactionCommand: {
                id: IdConstants.PermissionOverridesRoleBasic
            }
        }],
        ["permission-overrides-role-stacking", {
            interactionCommand: {
                id: IdConstants.PermissionOverridesRoleStacking
            }
        }],
        ["permission-overrides-user-basic", {
            interactionCommand: {
                id: IdConstants.PermissionOverridesUserBasic
            }
        }],
        ["permission-overrides-user-override-role", {
            interactionCommand: {
                id: IdConstants.PermissionOverridesUserOverrideRole
            }
        }],
        ["permission-overrides-channel-basic", {
            interactionCommand: {
                id: IdConstants.PermissionOverridesChannelBasic
            }
        }],
        ["permission-overrides-channel-all-channels", {
            interactionCommand: {
                id: IdConstants.PermissionOverridesChannelAllChannels
            }
        }],
        ["permission-overrides-channel-override-all-channels", {
            interactionCommand: {
                id: IdConstants.PermissionOverridesChannelOverrideAllChannels
            }
        }],
        ["permission-overrides-channel-override-role", {
            interactionCommand: {
                id: IdConstants.PermissionOverridesChannelOverrideRole
            }
        }],
        ["permission-overrides-channel-override-user", {
            interactionCommand: {
                id: IdConstants.PermissionOverridesChannelOverrideUser
            }
        }],
        ["permission-overrides-allow-owner", {
            interactionCommand: {
                id: IdConstants.PermissionOverridesAllowOwner
            }
        }],
    ].map(([path, overrides]: [string, Partial<Command>]) => merge({
        path,
        key: path.split("/").reverse()[0],
        translationPath: path.replaceAll(/[^a-z_]/g, "_"),
        nameTranslations: {
            ["en-US"]: path
        },
        descriptionTranslations: {},
        usageTranslations: {},
        handler: () => { },
        allowDMs: true,
        ownerOnly: false,
        defaultMemberPermissions: [],
        interactionCommand: null,
        conditions: [],
        args: {
            min: 0,
            max: 0,
            stringTranslations: {},
            list: [],
            lastArgAsExtras: false
        },
        alwaysReactOnSuccess: true,
        subcommands: new Map()
    }, overrides));

    return new constructor(
        {
            on: sinon.stub(),
            application: {
                commands: {
                    set: (commands: ApplicationCommandDataResolvable[]) =>
                        commands.map((command, i) => ({ ...command, id: i.toString() })),
                    
                    permissions: {
                        fetch: async (
                            { guild: { id: guildId }, command: commandId }:
                            { guild: { id: string }, command: Snowflake }) => {
                            switch (commandId) {
                                case IdConstants.PermissionOverridesNone:
                                    throw new Error();
                                
                                case IdConstants.PermissionOverridesRoleBasic:
                                    return [{
                                        type: ApplicationCommandPermissionType.Role,
                                        id: IdConstants.Role1,
                                        permission: guildId === IdConstants.Guild1
                                    }];
                                case IdConstants.PermissionOverridesRoleStacking:
                                    return [{
                                        type: ApplicationCommandPermissionType.Role,
                                        id: IdConstants.Role1,
                                        permission: true
                                    }, {
                                        type: ApplicationCommandPermissionType.Role,
                                        id: IdConstants.Role2,
                                        permission: false
                                    }];
                                
                                case IdConstants.PermissionOverridesUserBasic:
                                    return [{
                                        type: ApplicationCommandPermissionType.User,
                                        id: IdConstants.User1,
                                        permission: guildId === IdConstants.Guild1
                                    }];
                                case IdConstants.PermissionOverridesUserOverrideRole:
                                    return [{
                                        type: ApplicationCommandPermissionType.Role,
                                        id: IdConstants.Role1,
                                        permission: true
                                    }, {
                                        type: ApplicationCommandPermissionType.User,
                                        id: IdConstants.User1,
                                        permission: false
                                    }];
                                
                                case IdConstants.PermissionOverridesChannelBasic:
                                    return [{
                                        type: ApplicationCommandPermissionType.Channel,
                                        id: IdConstants.Channel1,
                                        permission: guildId === IdConstants.Guild1
                                    }];
                                case IdConstants.PermissionOverridesChannelAllChannels:
                                    return [{
                                        type: ApplicationCommandPermissionType.Channel,
                                        id: `${_IdConstants.Guild1 - 1}`,
                                        permission: false
                                    }];
                                case IdConstants.PermissionOverridesChannelOverrideAllChannels:
                                    return [{
                                        type: ApplicationCommandPermissionType.Channel,
                                        id: `${_IdConstants.Guild1 - 1}`,
                                        permission: true
                                    }, {
                                        type: ApplicationCommandPermissionType.Channel,
                                        id: IdConstants.Channel1,
                                        permission: false
                                    }];
                                case IdConstants.PermissionOverridesChannelOverrideRole:
                                    return [{
                                        type: ApplicationCommandPermissionType.Role,
                                        id: IdConstants.Role1,
                                        permission: true
                                    }, {
                                        type: ApplicationCommandPermissionType.Channel,
                                        id: IdConstants.Channel1,
                                        permission: false
                                    }];
                                case IdConstants.PermissionOverridesChannelOverrideUser:
                                    return [{
                                        type: ApplicationCommandPermissionType.User,
                                        id: IdConstants.User1,
                                        permission: true
                                    }, {
                                        type: ApplicationCommandPermissionType.Channel,
                                        id: IdConstants.Channel1,
                                        permission: false
                                    }];
                                
                                case IdConstants.PermissionOverridesAllowOwner:
                                    return [{
                                        type: ApplicationCommandPermissionType.Role,
                                        id: IdConstants.Role1,
                                        permission: false
                                    }, {
                                        type: ApplicationCommandPermissionType.User,
                                        id: IdConstants.UserBotOwner,
                                        permission: false
                                    }, {
                                        type: ApplicationCommandPermissionType.Channel,
                                        id: IdConstants.Channel1,
                                        permission: false
                                    }];
                                
                                default:
                                    throw new Error();
                            }
                        }
                    }
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
            ] as any),
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
            resolveCommand(path: string | string[]) {
                if (Array.isArray(path))
                    path = path.join(" ");
                return commands?.find(command => command.path === path);
            },
            resolveCommandByLocalizedPath(path: string | string[]) {
                return this.resolveCommand(path);
            },
            getCommandUsageString(command: Command) {
                return `<usage:${command.path}>`;
            }
        } as unknown as CommandRegistry,
        options
    )
}
