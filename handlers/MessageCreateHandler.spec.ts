import assert from "assert";
import { Guild, GuildMember, Message, TextBasedChannel, User } from "discord.js";
import { merge } from "lodash-es";
import sinon from "sinon";
import { Merge, PartialDeep } from "type-fest";
import { MessageCreateHandler, MessageHandlerOptions, successEmoji } from "./MessageCreateHandler";
import { createHandler, IdConstants } from "./testData/util";

describe(MessageCreateHandler.name, () => {
    type Clean<T> = Omit<T, "toString" | "valueOf">;

    type MessageOverrides = PartialDeep<Clean<Merge<Message, {
        author: Clean<User>,
        member: Clean<Merge<GuildMember, {
            permissions: Clean<GuildMember["permissions"]>
        }>>,
        guild: Clean<Guild> | null,
        channel: Clean<TextBasedChannel>
    }>>>;

    let handlerOptions: MessageHandlerOptions;

    beforeEach(() => {
        handlerOptions = {
            prefix: "!",
            ignorePermissionsFor: IdConstants.UserBotOwner
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
                send: sinon.stub()
            },
            get channelId() {
                return this.channel.id;
            },
            react: sinon.stub(),
            reactions: {
                resolve: () => { }
            }
        }, overrides);
    }

    async function handleCommand(contentOrOverrides: string | MessageOverrides) {
        const handler = await createHandler(MessageCreateHandler, undefined, handlerOptions).init();
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
        assert(message.channel.send.notCalled);
        assert(message.react.calledOnceWith(successEmoji));
    }

    async function shouldIgnore(contentOrOverrides: string | MessageOverrides) {
        const message = await handleCommand(contentOrOverrides);
        assert(message.channel.send.notCalled);
        assert(message.react.notCalled);
    }


    it("Ignore bots and webhooks", async () => {
        const handler = await createHandler(MessageCreateHandler).init();
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
        describe("Owner only", () => {
            it("Not bot owner", () => shouldIgnore("!owner-only"));
            it("Bot owner", () => shouldSucceed({
                content: "!owner-only",
                author: {
                    id: IdConstants.UserBotOwner
                }
            }));
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

        }));

        it("Show error when disallowed", () => {

        });
    });
});
