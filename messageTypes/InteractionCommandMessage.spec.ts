import { assert } from "console";
import { BitField, CommandInteraction, MessageFlags } from "discord.js";
import sinon from "sinon";
import { Command } from "../definitions";
import { Translator } from "../Translator";
import { InteractionCommandMessage } from "./InteractionCommandMessage";

describe(InteractionCommandMessage.name, () => {

    describe(`#${InteractionCommandMessage.prototype.completeSilently.name}`, () => {
        it("Defer only if possible", async () => {
            for (const prop of ["deferred", "replied"]) {
                const commandMessage = new InteractionCommandMessage({} as Command, {} as Translator, {
                    deferred: false,
                    replied: false,
                    [prop]: true,
                    deleteReply: sinon.stub().resolves()
                } as unknown as CommandInteraction);
                await commandMessage.completeSilently();
            }

            const commandInteraction = {
                deferred: false,
                replied: false,
                deferReply: sinon.stub().resolves(),
                deleteReply: sinon.stub().resolves()
            };
            const commandMessage = new InteractionCommandMessage({} as Command, {} as Translator, commandInteraction as unknown as CommandInteraction);
            await commandMessage.completeSilently();
            assert(commandInteraction.deferReply.calledOnce);
            assert(commandInteraction.deleteReply.calledOnce);
        });

        it("Ignore delete rejection", async () => {
            const commandInteraction = {
                deferred: false,
                replied: false,
                deferReply: sinon.stub().resolves(),
                deleteReply: sinon.stub().rejects()
            };
            const commandMessage = new InteractionCommandMessage({} as Command, {} as Translator, commandInteraction as unknown as CommandInteraction);
            await commandMessage.completeSilently();
            assert(commandInteraction.deferReply.calledOnce);
            assert(commandInteraction.deleteReply.calledOnce);
        });
    });

    describe(`#${InteractionCommandMessage.prototype.deferReply.name}`, () => {
        it("Defers only once", async () => {
            const commandInteraction = {
                deferReply: sinon.stub().resolves()
            };
            const commandMessage = new InteractionCommandMessage({} as Command, {} as Translator, commandInteraction as unknown as CommandInteraction);
            await commandMessage.deferReply();
            await commandMessage.deferReply(false);
            sinon.assert.calledOnceWithExactly(commandInteraction.deferReply, {
                ephemeral: true,
                fetchReply: true
            });
        });
    });

    describe(`#${InteractionCommandMessage.prototype.reply.name}`, () => {
        it("Accept strings", async () => {
            const commandInteraction = {
                reply: sinon.stub().resolves()
            };
            const commandMessage = new InteractionCommandMessage({} as Command, {} as Translator, commandInteraction as unknown as CommandInteraction);
            await commandMessage.reply("test");
            sinon.assert.calledOnceWithExactly(commandInteraction.reply, {
                ephemeral: true,
                content: "test",
                fetchReply: true
            });
        });

        it("Respect ephemeral and ignore fetchReply", async () => {
            const commandInteraction = {
                reply: sinon.stub().resolves()
            };
            const commandMessage = new InteractionCommandMessage({} as Command, {} as Translator, commandInteraction as unknown as CommandInteraction);
            await commandMessage.reply({
                ephemeral: false,
                content: "test",
                fetchReply: false
            });
            sinon.assert.calledOnceWithExactly(commandInteraction.reply, {
                ephemeral: false,
                content: "test",
                fetchReply: true
            });
        });

        it("Allow reply after defer", async () => {
            const commandInteraction = {
                deferReply: sinon.stub().resolves({
                    flags: new BitField(MessageFlags.Loading)
                }),
                followUp: sinon.stub().resolves()
            };
            const commandMessage = new InteractionCommandMessage({} as Command, {} as Translator, commandInteraction as unknown as CommandInteraction);
            await commandMessage.deferReply();
            await commandMessage.reply("test");
            sinon.assert.calledOnceWithExactly(commandInteraction.deferReply, {
                ephemeral: true,
                fetchReply: true
            });
            sinon.assert.calledOnceWithExactly(commandInteraction.followUp, "test");
        });
    });

    it(`#${InteractionCommandMessage.prototype.sendSeparate.name}`, async () => {
        const commandInteraction = {
            channel: {
                send: sinon.stub().resolves()
            }
        };
        const commandMessage = new InteractionCommandMessage({} as Command, {} as Translator, commandInteraction as unknown as CommandInteraction);
        await commandMessage.sendSeparate("test");
        sinon.assert.calledOnceWithExactly(commandInteraction.channel.send, "test");
    });
});
