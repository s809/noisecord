import { expect } from "chai";
import { BitField, CommandInteraction, MessageFlags } from "discord.js";
import sinon from "sinon";
import { Command } from "../definitions.js";
import { Translator } from "../Translator.js";
import { InteractionCommandRequest } from "./InteractionCommandRequest.js";

describe(InteractionCommandRequest.name, () => {

    describe(`#${InteractionCommandRequest.prototype.completeSilently.name}`, () => {
        it("Defer only if possible", async () => {
            for (const prop of ["deferred", "replied"]) {
                const CommandRequest = new InteractionCommandRequest({} as Command, {} as Translator, {
                    deferred: false,
                    replied: false,
                    [prop]: true,
                    deleteReply: sinon.stub().resolves()
                } as unknown as CommandInteraction);
                await CommandRequest.completeSilently();
            }

            const commandInteraction = {
                deferred: false,
                replied: false,
                deferReply: sinon.stub().resolves(),
                deleteReply: sinon.stub().resolves()
            };
            const CommandRequest = new InteractionCommandRequest({} as Command, {} as Translator, commandInteraction as unknown as CommandInteraction);
            await CommandRequest.completeSilently();
            expect(commandInteraction.deferReply).calledOnce;
            expect(commandInteraction.deleteReply).calledOnce;
        });

        it("Ignore delete rejection", async () => {
            const commandInteraction = {
                deferred: false,
                replied: false,
                deferReply: sinon.stub().resolves(),
                deleteReply: sinon.stub().rejects()
            };
            const CommandRequest = new InteractionCommandRequest({} as Command, {} as Translator, commandInteraction as unknown as CommandInteraction);
            await CommandRequest.completeSilently();
            expect(commandInteraction.deferReply).calledOnce;
            expect(commandInteraction.deleteReply).calledOnce;
        });
    });

    describe(`#${InteractionCommandRequest.prototype.deferReply.name}`, () => {
        it("Defers only once", async () => {
            const commandInteraction = {
                deferReply: sinon.stub().resolves()
            };
            const CommandRequest = new InteractionCommandRequest({} as Command, {} as Translator, commandInteraction as unknown as CommandInteraction);
            await CommandRequest.deferReply();
            await CommandRequest.deferReply(false);
            expect(commandInteraction.deferReply).calledOnceWithExactly({
                ephemeral: true,
                fetchReply: true
            });
        });
    });

    describe(`#${InteractionCommandRequest.prototype.reply.name}`, () => {
        it("Accept strings", async () => {
            const commandInteraction = {
                reply: sinon.stub().resolves()
            };
            const CommandRequest = new InteractionCommandRequest({} as Command, {} as Translator, commandInteraction as unknown as CommandInteraction);
            await CommandRequest.reply("test");
            expect(commandInteraction.reply).calledOnceWithExactly({
                ephemeral: true,
                content: "test",
                fetchReply: true
            });
        });

        it("Respect ephemeral and ignore fetchReply", async () => {
            const commandInteraction = {
                reply: sinon.stub().resolves()
            };
            const CommandRequest = new InteractionCommandRequest({} as Command, {} as Translator, commandInteraction as unknown as CommandInteraction);
            await CommandRequest.reply({
                ephemeral: false,
                content: "test",
                fetchReply: false
            });
            expect(commandInteraction.reply).calledOnceWithExactly({
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
            const CommandRequest = new InteractionCommandRequest({} as Command, {} as Translator, commandInteraction as unknown as CommandInteraction);
            await CommandRequest.deferReply();
            await CommandRequest.reply("test");
            expect(commandInteraction.deferReply).calledOnceWithExactly({
                ephemeral: true,
                fetchReply: true
            });
            expect(commandInteraction.followUp).calledOnceWithExactly("test");
        });
    });

    it(`#${InteractionCommandRequest.prototype.sendSeparate.name}`, async () => {
        const commandInteraction = {
            channel: {
                send: sinon.stub().resolves()
            }
        };
        const CommandRequest = new InteractionCommandRequest({} as Command, {} as Translator, commandInteraction as unknown as CommandInteraction);
        await CommandRequest.sendSeparate("test");
        expect(commandInteraction.channel.send).calledOnceWithExactly("test");
    });
});
