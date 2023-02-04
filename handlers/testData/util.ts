import { ApplicationCommandOptionType, ApplicationCommandDataResolvable, Client } from "discord.js";
import { CommandRegistry } from "../../CommandRegistry";
import { Command } from "../../definitions";
import { CommandMessage } from "../../messageTypes/CommandMessage";
import { setTimeout } from "timers/promises";
import sinon from "sinon";

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
            handler: () => { },
            allowDMs: true,
            conditions: [],
            args: {
                min: 0,
                max: 0,
                list: []
            },
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
        },
        {
            path: "owner-only",
            translationPath: "owner_only",
            handler: () => { },
            ownerOnly: true,
            conditions: [],
            args: {
                min: 0,
                max: 0,
                list: []
            },
            subcommands: new Map()
        },
        {
            path: "dm-no",
            translationPath: "dm_no",
            handler: () => { },
            allowDMs: false,
            conditions: [],
            args: {
                min: 0,
                max: 0,
                list: []
            },
            subcommands: new Map()
        },
    ] as any;

    return new constructor(
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