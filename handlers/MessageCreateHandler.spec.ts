import assert from "assert";
import { GuildMember, Message, User } from "discord.js";
import { merge } from "lodash-es";
import sinon from "sinon";
import { Merge, PartialDeep } from "type-fest";
import { MessageCreateHandler, successEmoji } from "./MessageCreateHandler";
import { createHandler } from "./testData/util";

describe(MessageCreateHandler.name, () => {
    type Clean<T> = Omit<T, "toString" | "valueOf">;

    type MessageOverrides = PartialDeep<Clean<Merge<Message, {
        author: Clean<User>,
        member: Clean<Merge<GuildMember, {
            permissions: Clean<GuildMember["permissions"]>
        }>>
    }>>>;

    function createMessage(overrides: MessageOverrides) {
        return merge({
            author: {
                bot: false
            },
            webhookId: null,
            content: "",
            inGuild: () => true,
            channel: {
                send: sinon.stub()
            },
            react: sinon.stub(),
            reactions: {
                resolve: () => { }
            }
        }, overrides);
    }

    async function handleCommand(contentOrOverrides: string | MessageOverrides) {
        const handler = await createHandler(MessageCreateHandler, undefined, {
            prefix: "!",
            ignorePermissionsFor: "1001"
        }).init();
        const message = createMessage(typeof contentOrOverrides === "object"
            ? contentOrOverrides
            : {
                content: contentOrOverrides
            });
        await handler.handle(message as unknown as Message);
        return message;
    }

    async function shouldIgnore(contentOrOverrides: string | MessageOverrides) {
        const message = await handleCommand(contentOrOverrides);
        assert(message.channel.send.notCalled);
        assert(message.react.notCalled);
    }

    async function shouldSucceed(contentOrOverrides: string | MessageOverrides) {
        const message = await handleCommand(contentOrOverrides);
        assert(message.channel.send.notCalled);
        assert(message.react.calledOnceWith(successEmoji));
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

    describe("Ignore non-commands", () => {
        it("Not starting with prefix", () => shouldIgnore("test"));
        it("Unknown command", () => shouldIgnore("!unknown-command"));
        it("No handler", () => shouldIgnore("!no-handler"));
    });

    describe("Check command permissions", () => {
        describe("Owner only", () => {
            it("Not bot owner", () => shouldIgnore("!owner-only"));
            it("Bot owner", () => shouldSucceed({
                content: "!owner-only",
                author: {
                    id: "1001"
                }
            }));
        });

        describe("DM behavior", () => {
            it("DM only", () => shouldIgnore({
                content: "!dm-no",
                inGuild: () => false
            }));

            it("Not DM only", () => shouldSucceed({
                content: "!normal",
                inGuild: () => false
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
                    id: "1001"
                },
                member: {
                    permissions: {
                        has: () => false
                    }
                }
            }));
        });
    });
});