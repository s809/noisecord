import { expect } from "chai";
import { ChannelType, Guild, GuildBasedChannel, GuildMember, Message, Role } from "discord.js";
import { merge } from "lodash-es";
import sinon from "sinon";
import { Merge, PartialDeep } from "type-fest";
import { loadingEmoji, _MessageHandler, MessageHandlerOptions, successEmoji } from "./MessageHandler.js";
import { createHandler, IdConstants } from "../testData/index.js";

describe(_MessageHandler.name, () => {
    type Clean<T> = Omit<T, "toString" | "valueOf">;
    type CleanSome<T, ToPick extends keyof T, U = {}> = Clean<Merge<Merge<T, {
        [K in ToPick]: Clean<T[K]>
    }>, U>>;

    type MessageOverrides = PartialDeep<CleanSome<Message, "author" | "channel", {
        member: CleanSome<GuildMember, "permissions"> | null,
        guild: CleanSome<Guild, "channels" | "members" | "roles"> | null
    }>>;

    let handlerOptions: MessageHandlerOptions;

    beforeEach(() => {
        handlerOptions = {
            prefix: "!",
            ignoreAllPermissionsFor: IdConstants.UserBotOwner
        };
    });

    function createMessage(overrides: MessageOverrides) {
        return merge({
            author: {
                bot: false,
                id: IdConstants.UserNone
            },
            webhookId: null,
            content: "",
            inGuild() {
                return !!this.guildId;
            },
            guild: {
                id: IdConstants.ChannelNone
            },
            get guildId() {
                return this.guild?.id ?? null;
            },
            member: {
                permissions: {
                    has: () => true
                },
                roles: {
                    resolve(id: string) {
                        return new Map<string, { position: number }>([
                            [IdConstants.Role1, { position: 0 }],
                            [IdConstants.Role2, { position: 1 }],
                            [IdConstants.Role3, { position: 2 }]
                        ]).get(id) ?? null;
                    }
                }
            },
            channel: {
                id: IdConstants.ChannelNone,
                send: sinon.stub().resolves()
            },
            get channelId() {
                return this.channel.id;
            },
            react: sinon.stub().resolves(),
            reactions: {
                resolve: () => { }
            }
        }, overrides);
    }

    async function handleCommand(contentOrOverrides: string | MessageOverrides) {
        const handler = await createHandler(_MessageHandler, undefined, handlerOptions).init();
        const message = createMessage(typeof contentOrOverrides === "object"
            ? contentOrOverrides
            : {
                content: contentOrOverrides
            });
        await handler.handle(message as unknown as Message);
        return message;
    }

    async function shouldSucceed(contentOrOverrides: string | MessageOverrides) {
        const message = await handleCommand(contentOrOverrides);
        expect(message.channel.send).not.called;
        expect(message.react).calledOnceWith(successEmoji);
    }

    async function shouldIgnore(contentOrOverrides: string | MessageOverrides) {
        const message = await handleCommand(contentOrOverrides);
        expect(message.channel.send).not.called;
        expect(message.react).not.called;
    }

    async function shouldFail(contentOrOverrides: string | MessageOverrides, errorContent: string | RegExp) {
        const message = await handleCommand(contentOrOverrides);
        expect(message.channel.send).calledOnceWith(errorContent instanceof RegExp
            ? sinon.match(errorContent)
            : errorContent
        );
    }


    it("Ignore bots and webhooks", async () => {
        const handler = await createHandler(_MessageHandler).init();
        await handler.handle(createMessage({
            author: {
                bot: true
            }
        }) as unknown as Message);
        await handler.handle(createMessage({
            author: {
                bot: false
            },
            webhookId: "0"
        }) as unknown as Message);
    });
    
    describe("Prefix handling", () => {
        describe("String", () => {
            it("Without prefix", () => shouldIgnore("normal"));
            it("With prefix", () => shouldSucceed("!normal"));
        });

        describe("Map", () => {
            beforeEach(() => {
                handlerOptions.prefix = new Map([
                    [null, "#"],
                    [IdConstants.User1, "?"],
                    [IdConstants.Guild1, "@"]
                ]);
            });

            it("No prefix", () => shouldIgnore("normal"));

            describe("Global", () => {
                it("Accept", () => shouldSucceed({
                    content: "#normal"
                }));
            });

            describe("Author custom", () => {
                it("Accept", () => shouldSucceed({
                    content: "?normal",
                    author: {
                        id: IdConstants.User1
                    }
                }));
                
                it("Ignore global", () => shouldIgnore({
                    content: "#normal",
                    author: {
                        id: IdConstants.User1
                    }
                }));
            });

            describe("Guild custom", () => {
                it("Accept", () => shouldSucceed({
                    content: "@normal",
                    author: {
                        id: IdConstants.User1
                    },
                    guild: {
                        id: IdConstants.Guild1
                    }
                }));

                it("Ignore global", () => shouldIgnore({
                    content: "#normal",
                    author: {
                        id: IdConstants.User1
                    },
                    guild: {
                        id: IdConstants.Guild1
                    }
                }));

                it("Ignore author custom", () => shouldIgnore({
                    content: "?normal",
                    author: {
                        id: IdConstants.User1
                    },
                    guild: {
                        id: IdConstants.Guild1
                    }
                }));
            })
        });
        
        it("Custom function", async () => {
            handlerOptions.prefix = msg => msg.content.startsWith("!!") ? "!!" : null;
            await shouldSucceed("!!normal");
        });
    })
    
    describe("Ignore non-commands", () => {
        it("Unknown command", () => shouldIgnore("!unknown-command"));
        it("No handler", () => shouldIgnore("!no-handler"));
    });

    describe("Check command permissions", () => {
        describe("ignoreAllPermissionsFor", () => {
            describe("None", () => {
                beforeEach(() => {
                    handlerOptions.ignoreAllPermissionsFor = undefined;
                });

                it("Should always ignore", () => shouldIgnore({
                    content: "!owner-only",
                    author: {
                        id: IdConstants.User1
                    }
                }));
            })

            describe("String", () => {
                beforeEach(() => {
                    handlerOptions.ignoreAllPermissionsFor = IdConstants.User1;
                });

                it("Accept owner", () => shouldSucceed({
                    content: "!owner-only",
                    author: {
                        id: IdConstants.User1
                    }
                }));

                it("Ignore non-owner", () => shouldIgnore({
                    content: "!owner-only",
                    author: {
                        id: IdConstants.UserNone
                    }
                }));
            });

            describe("Array", () => {
                beforeEach(() => {
                    handlerOptions.ignoreAllPermissionsFor = [IdConstants.UserBotOwner, IdConstants.User1];
                });

                it("Accept owner 1", () => shouldSucceed({
                    content: "!owner-only",
                    author: {
                        id: IdConstants.UserBotOwner
                    }
                }));

                it("Accept owner 2", () => shouldSucceed({
                    content: "!owner-only",
                    author: {
                        id: IdConstants.User1
                    }
                }));

                it("Ignore non-owner", () => shouldIgnore({
                    content: "!owner-only",
                    author: {
                        id: IdConstants.UserNone
                    }
                }));
            });

            describe("Custom function", () => {
                beforeEach(() => {
                    handlerOptions.ignoreAllPermissionsFor = msg => msg.author.id === IdConstants.User1;
                });

                it("Accept owner", () => shouldSucceed({
                    content: "!owner-only",
                    author: {
                        id: IdConstants.User1
                    }
                }));

                it("Ignore non-owner", () => shouldIgnore({
                    content: "!owner-only",
                    author: {
                        id: IdConstants.UserNone
                    }
                }));
            });
        });

        describe("DM behavior", () => {
            it("DM only", () => shouldIgnore({
                content: "!dm-no",
                guild: null
            }));

            it("Not DM only", () => shouldSucceed({
                content: "!normal",
                guild: null
            }));
        });

        describe("Member permissions", () => {
            it("Not allowed", () => shouldIgnore({
                content: "!normal",
                member: {
                    permissions: {
                        has: () => false
                    }
                }
            }));

            it("Allowed", () => shouldSucceed({
                content: "!normal",
                member: {
                    permissions: {
                        has: () => true
                    }
                }
            }));

            it("Always allow for owner", () => shouldSucceed({
                content: "!normal",
                author: {
                    id: IdConstants.UserBotOwner
                },
                member: {
                    permissions: {
                        has: () => false
                    }
                }
            }));

            describe("Permission overrides", () => {
                it("No overrides", () => shouldSucceed({
                    content: "!permission-overrides-none",
                    guild: {
                        id: IdConstants.Guild1
                    }
                }));

                describe("Role", () => {
                    it("Allow when allowed", () => shouldSucceed({
                        content: "!permission-overrides-role-basic",
                        guild: {
                            id: IdConstants.Guild1
                        }
                    }));

                    it("Ignore when disallowed", () => shouldIgnore({
                        content: "!permission-overrides-role-basic",
                        guild: {
                            id: IdConstants.Guild2
                        }
                    }));

                    it("Upper roles override lower", () => shouldIgnore({
                        content: "!permission-overrides-role-stacking",
                        guild: {
                            id: IdConstants.Guild1
                        }
                    }));
                });

                describe("User", () => {
                    it("Allow when allowed", () => shouldSucceed({
                        content: "!permission-overrides-user-basic",
                        guild: {
                            id: IdConstants.Guild1
                        },
                        author: {
                            id: IdConstants.User1
                        }
                    }));

                    it("Ignore when disallowed", () => shouldIgnore({
                        content: "!permission-overrides-user-basic",
                        guild: {
                            id: IdConstants.Guild2
                        },
                        author: {
                            id: IdConstants.User1
                        }
                    }));

                    it("Override role permissions", () => shouldIgnore({
                        content: "!permission-overrides-user-override-role",
                        guild: {
                            id: IdConstants.Guild1
                        },
                        author: {
                            id: IdConstants.User1
                        }
                    }));
                })

                describe("Channel", () => {
                    it("Allow when allowed", () => shouldSucceed({
                        content: "!permission-overrides-channel-basic",
                        guild: {
                            id: IdConstants.Guild1
                        }, 
                        channel: {
                            id: IdConstants.Channel1
                        }
                    }));
                    
                    it("Ignore when disallowed", () => shouldIgnore({
                        content: "!permission-overrides-channel-basic",
                        guild: {
                            id: IdConstants.Guild2
                        },
                        channel: {
                            id: IdConstants.Channel1
                        }
                    }));

                    it("All channels", () => shouldIgnore({
                        content: "!permission-overrides-channel-all-channels",
                        guild: {
                            id: IdConstants.Guild1
                        },
                        channel: {
                            id: IdConstants.Channel1
                        }
                    }));

                    it("Override 'All channels'", () => shouldIgnore({
                        content: "!permission-overrides-channel-override-all-channels",
                        guild: {
                            id: IdConstants.Guild1
                        },
                        channel: {
                            id: IdConstants.Channel1
                        }
                    }));

                    it("Override role permissions", () => shouldIgnore({
                        content: "!permission-overrides-channel-override-role",
                        guild: {
                            id: IdConstants.Guild1
                        },
                        channel: {
                            id: IdConstants.Channel1
                        }
                    }));

                    it("Override user permissions", () => shouldIgnore({
                        content: "!permission-overrides-channel-override-user",
                        guild: {
                            id: IdConstants.Guild1
                        },
                        channel: {
                            id: IdConstants.Channel1
                        },
                        author: {
                            id: IdConstants.User1
                        }
                    }));
                });

                it("Ignore permissions for owner", () => shouldSucceed({
                    content: "!permission-overrides-allow-owner",
                    guild: {
                        id: IdConstants.Guild1
                    },
                    channel: {
                        id: IdConstants.Channel1
                    },
                    author: {
                        id: IdConstants.UserBotOwner
                    }
                }));
            });
        });
    });

    describe("Check command conditions", () => {
        it("Allow when allowed", () => shouldSucceed({
            content: "!conditions",
            guild: {
                id: IdConstants.Guild1
            }
        }));

        it("Show error when disallowed", () => shouldFail({
            content: "!conditions",
            guild: {
                id: IdConstants.Guild2
            }
        }, "Test condition"));
    });

    describe("Argument parsing", () => {
        const messagePart = {
            guild: {
                id: IdConstants.Guild1,
                channels: {
                    resolve: (id: any) => ([IdConstants.Channel1, IdConstants.Channel2].includes(id)
                        ? {
                            id: IdConstants.Channel1,
                            type: id === IdConstants.Channel1
                                ? ChannelType.GuildText
                                : ChannelType.GuildVoice,
                            toString: () => `<#${id}>`
                        }
                        : null) as GuildBasedChannel
                },
                members: {
                    resolve: (id: any) => (id === IdConstants.User1
                        ? {
                            id: IdConstants.User1
                        }
                        : null) as GuildMember
                },
                roles: {
                    resolve: (id: any) => (id === IdConstants.Role1
                        ? {
                            id: IdConstants.Role1
                        }
                        : null) as Role
                }
            },
        }

        describe("Argument count", () => {
            it("Min", () => shouldFail("!arguments-count a", `
command_processor: errors.too_few_arguments
command_processor: strings.command_usage {"usage":"<usage:arguments-count>"}
            `.trim()));

            it("Max", () => shouldFail("!arguments-count a b c d", `
command_processor: errors.too_many_arguments
command_processor: strings.command_usage {"usage":"<usage:arguments-count>"}
            `.trim()));
        });

        it("All arguments", () => shouldFail({
            content: `!all-arguments string 1 2 yes <#${IdConstants.Channel1}> <@${IdConstants.User1}> <@&${IdConstants.Role1}>`,
            ...messagePart
        }, `all_arguments: errors.string 1 2 true ${IdConstants.Channel1} ${IdConstants.User1} ${IdConstants.Role1}`));

        describe("Argument types", () => {
            describe("String", () => {
                it("Min length", () => shouldFail("!args-string a", `
command_processor: errors.value_too_short {"arg":"\\"a\\" (command_processor: strings.argument_name {\\"name\\":\\"argString\\"})","minLength":2}
command_processor: strings.command_usage {"usage":"<usage:args-string>"}`.trim()));
                
                it("Max length", () => shouldFail("!args-string aaaa", `
command_processor: errors.value_too_long {"arg":"\\"aaaa\\" (command_processor: strings.argument_name {\\"name\\":\\"argString\\"})","maxLength":3}
command_processor: strings.command_usage {"usage":"<usage:args-string>"}`.trim()));
                
                describe("Choices", () => {
                    it("Default choice", () => shouldSucceed("!args-string-choices a"));
                    it("Localized choice", () => shouldSucceed("!args-string-choices tr_a"));
                    it("Invalid choice", () => shouldFail("!args-string-choices tr_b", `
command_processor: errors.value_not_allowed {"arg":"\\"tr_b\\" (command_processor: strings.argument_name {\\"name\\":\\"argString\\"})","allowedValues":"\\"tr_a\\""}
command_processor: strings.command_usage {"usage":"<usage:args-string-choices>"}`.trim()));
                });
            });

            describe("Number/integer", () => {
                it("Min value", () => shouldFail("!args-number 1", `
command_processor: errors.value_too_small {"arg":"\\"1\\" (command_processor: strings.argument_name {\\"name\\":\\"argNumber\\"})","minValue":2}
command_processor: strings.command_usage {"usage":"<usage:args-number>"}`.trim()));
                it("Max value", () => shouldFail("!args-number 4", `
command_processor: errors.value_too_large {"arg":"\\"4\\" (command_processor: strings.argument_name {\\"name\\":\\"argNumber\\"})","maxValue":3}
command_processor: strings.command_usage {"usage":"<usage:args-number>"}`.trim()));

                describe("Choices", () => {
                    it("Valid choice", () => shouldSucceed("!args-integer 1"));
                    it("Invalid choice", () => shouldFail("!args-integer 2", `
command_processor: errors.value_not_allowed {"arg":"\\"2\\" (command_processor: strings.argument_name {\\"name\\":\\"argInteger\\"})","allowedValues":"1"}
command_processor: strings.command_usage {"usage":"<usage:args-integer>"}`.trim()));
                })
            });

            describe("Boolean", () => {
                it("Valid boolean", () => shouldSucceed("!args-boolean yes"));
                it("Invalid boolean", () => shouldFail("!args-boolean test", `
command_processor: errors.invalid_boolean {"arg":"\\"test\\" (command_processor: strings.argument_name {\\"name\\":\\"argBoolean\\"})"}
command_processor: strings.command_usage {"usage":"<usage:args-boolean>"}`.trim()));
            });

            describe("Resolvable", () => {
                it("Parse with id", () => shouldFail({
                    content: `!args-resolvable <#${IdConstants.Channel1}> <@${IdConstants.User1}> <@&${IdConstants.Role1}>`,
                    ...messagePart
                }, `args_resolvable: errors.${IdConstants.Channel1} ${IdConstants.User1} ${IdConstants.Role1}`));

                it("Parse without id", () => shouldFail({
                    content: `!args-resolvable ${IdConstants.Channel1} ${IdConstants.User1} ${IdConstants.Role1}`,
                    ...messagePart
                }, `args_resolvable: errors.${IdConstants.Channel1} ${IdConstants.User1} ${IdConstants.Role1}`));

                describe("Invalid resolvable", () => {
                    describe("Channel", () => {
                        it("Non numeric id", () => shouldFail({
                            content: `!args-resolvable test ${IdConstants.User1} ${IdConstants.Role1}`,
                            ...messagePart
                        }, `
command_processor: errors.invalid_channel {"arg":"\\"test\\" (command_processor: strings.argument_name {\\"name\\":\\"argChannel\\"})"}
command_processor: strings.command_usage {"usage":"<usage:args-resolvable>"}`.trim()));

                        it("Missing id", () => shouldFail({
                            content: `!args-resolvable 10${IdConstants.Channel1} ${IdConstants.User1} ${IdConstants.Role1}`,
                            ...messagePart
                        }, `
command_processor: errors.invalid_channel {"arg":"\\"10${IdConstants.Channel1}\\" (command_processor: strings.argument_name {\\"name\\":\\"argChannel\\"})"}
command_processor: strings.command_usage {"usage":"<usage:args-resolvable>"}`.trim()));
                    });
                    
                    describe("User", () => {
                        it("Non numeric id", () => shouldFail({
                            content: `!args-resolvable ${IdConstants.Channel1} test ${IdConstants.Role1}`,
                            ...messagePart
                        }, `
command_processor: errors.invalid_user {"arg":"\\"test\\" (command_processor: strings.argument_name {\\"name\\":\\"argUser\\"})"}
command_processor: strings.command_usage {"usage":"<usage:args-resolvable>"}`.trim()));

                        it("Missing id", () => shouldFail({
                            content: `!args-resolvable ${IdConstants.Channel1} 10${IdConstants.User1} ${IdConstants.Role1}`,
                            ...messagePart
                        }, `
command_processor: errors.invalid_user {"arg":"\\"10${IdConstants.User1}\\" (command_processor: strings.argument_name {\\"name\\":\\"argUser\\"})"}
command_processor: strings.command_usage {"usage":"<usage:args-resolvable>"}`.trim()));
                    });

                    describe("Role", () => {
                        it("Non numeric id", () => shouldFail({
                            content: `!args-resolvable ${IdConstants.Channel1} ${IdConstants.User1} test`,
                            ...messagePart
                        }, `
command_processor: errors.invalid_role {"arg":"\\"test\\" (command_processor: strings.argument_name {\\"name\\":\\"argRole\\"})"}
command_processor: strings.command_usage {"usage":"<usage:args-resolvable>"}`.trim()));

                        it("Missing id", () => shouldFail({
                            content: `!args-resolvable ${IdConstants.Channel1} ${IdConstants.User1} 10${IdConstants.Role1}`,
                            ...messagePart
                        }, `
command_processor: errors.invalid_role {"arg":"\\"10${IdConstants.Role1}\\" (command_processor: strings.argument_name {\\"name\\":\\"argRole\\"})"}
command_processor: strings.command_usage {"usage":"<usage:args-resolvable>"}`.trim()));
                    });
                });

                describe("Channel type", () => {
                    it("Valid", () => shouldSucceed({
                        content: `!args-channel-types ${IdConstants.Channel1}`,
                        ...messagePart
                    }));

                    it("Invalid", () => shouldFail({
                        content: `!args-channel-types ${IdConstants.Channel2}`,
                        ...messagePart
                    }, `
command_processor: errors.channel_constraints_not_met {"arg":"\\"<#${IdConstants.Channel2}>\\" (command_processor: strings.argument_name {\\"name\\":\\"argChannel\\"})"}
command_processor: strings.command_usage {"usage":"<usage:args-channel-types>"}`.trim()));
                });
            });
        });

        it("Last arg as extras", () => shouldFail(`!last-arg-as-extras "1 2" 3 4 "5 6"`, `last_arg_as_extras: errors.1 2 3,4,5 6`));
    });

    describe("Execute command", () => {
        it("Success", () => shouldSucceed("!normal"));

        it("Slow command", async function () {
            this.slow(2000);

            const message = await handleCommand("!slow");
            expect(message.channel.send).not.called;
            expect(message.react.getCall(0)).calledWith(loadingEmoji);
            expect(message.react.getCall(1)).calledWith(successEmoji);
        });

        it("Manually replied", async () => {
            const message = await handleCommand("!auto manually-replied");
            expect(message.channel.send).calledOnceWithExactly({
                content: "YAAY",
                ephemeral: false
            });
        });

        it("Threw or rejected", () => shouldFail("!auto rejected", /Error/));
    })
});
