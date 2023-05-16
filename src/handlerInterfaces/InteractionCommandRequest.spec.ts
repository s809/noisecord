import { expect } from "chai";
import { BitField, CommandInteraction, MessageFlags } from "discord.js";
import sinon from "sinon";
import { Command } from "../definitions.js";
import { Translator } from "../Translator.js";
import { InteractionCommandRequest } from "./InteractionCommandRequest.js";

describe(InteractionCommandRequest.name, () => {
    function getCommandInteraction(manualResolve: ("deferReply" | "reply" | "followUp" | "deleteReply")[] = []) {
        let deferred = false;
        let replied = false;
        let deleted = false;

        let resolveDeferReply: (value: unknown) => void;
        let resolveReply: (value: unknown) => void;
        let resolveFollowUp: (value: unknown) => void;
        let resolveDeleteReply: (value: unknown) => void;

        let replyMessage = {
            flags: new BitField(MessageFlags.Loading)
        };

        return {
            interaction: {
                get deferred() {
                    return deferred;
                },
                get replied() {
                    return replied;
                },
                deferReply: sinon.stub().callsFake(async ({ fetchReply }) => {
                    if (!fetchReply) throw new Error("No fetchReply");

                    if (deferred) throw new Error("Already deferred");
                    if (replied) throw new Error("Cannot defer after reply");
                    
                    if (manualResolve.includes("deferReply"))
                        await new Promise(resolve => resolveDeferReply = resolve);
                    deferred = true;

                    return replyMessage = {
                        flags: new BitField(MessageFlags.Loading)
                    };
                }),
                reply: sinon.stub().callsFake(async ({ fetchReply }) => {
                    if (!fetchReply) throw new Error("No fetchReply");
                    
                    if (deferred) throw new Error("Cannot reply after defer");
                    if (replied) throw new Error("Already replied");

                    if (manualResolve.includes("reply"))
                        await new Promise(resolve => resolveReply = resolve);
                    replied = true;

                    return replyMessage = {
                        flags: new BitField()
                    };
                }),
                followUp: sinon.stub().callsFake(async ({ fetchReply }) => {
                    if (!fetchReply) throw new Error("No fetchReply");

                    if (!deferred) throw new Error("Not deferred");
                    if (replied) throw new Error("Already replied");
                    if (!replyMessage.flags.has(MessageFlags.Loading)) throw new Error("Already followed up");

                    if (manualResolve.includes("followUp"))
                        await new Promise(resolve => resolveFollowUp = resolve);

                    return replyMessage = {
                        flags: new BitField()
                    };
                }),
                deleteReply: sinon.stub().callsFake(async () => {
                    if (!deferred && !replied) throw new Error("Not replied or deferred");
                    if (deleted) throw new Error("Already deleted");

                    if (manualResolve.includes("deleteReply"))
                        await new Promise(resolve => resolveDeleteReply = resolve);
                    deleted = true;
                }),
                fetchReply: sinon.stub().callsFake(async () => {
                    if (!deferred && !replied) throw new Error("Not replied or deferred");
                    if (deleted) throw new Error("Deleted");

                    return replyMessage;
                }),
            } as unknown as CommandInteraction,
            get resolveDeferReply() {
                return resolveDeferReply;
            },
            get resolveReply() {
                return resolveReply;
            },
            get resolveFollowUp() {
                return resolveFollowUp;
            },
            get resolveDeleteReply() {
                return resolveDeleteReply;
            }
        }
    }

    describe(`#${InteractionCommandRequest.prototype.completeSilently.name}`, () => {
        it("Defer only if possible", async () => {
            it("Deferred", async () => {
                const { interaction } = getCommandInteraction();
                await interaction.deferReply();

                const commandRequest = new InteractionCommandRequest({} as Command, {} as Translator, interaction);
                await commandRequest.completeSilently();

                expect(interaction.deferReply).not.called;
                expect(interaction.deleteReply).calledOnce;
            });

            it("Replied", async () => {
                const { interaction } = getCommandInteraction();
                await interaction.reply({
                    content: "test",
                    fetchReply: true
                });

                const commandRequest = new InteractionCommandRequest({} as Command, {} as Translator, interaction);
                await commandRequest.completeSilently();

                expect(interaction.deferReply).not.called;
                expect(interaction.deleteReply).calledOnce;
            });

            it("Neither", async () => {
                const { interaction } = getCommandInteraction();
                
                const commandRequest = new InteractionCommandRequest({} as Command, {} as Translator, interaction);
                await commandRequest.completeSilently();

                expect(interaction.deferReply).calledOnce;
                expect(interaction.deleteReply).calledOnce;
            });
        });
    });

    describe(`#${InteractionCommandRequest.prototype.deferReply.name}`, () => {
        it("Defers only once", async () => {
            const { interaction } = getCommandInteraction();

            const commandRequest = new InteractionCommandRequest({} as Command, {} as Translator, interaction);
            await commandRequest.deferReply();
            await commandRequest.deferReply(false);
            
            expect(interaction.deferReply).calledOnceWithExactly({
                ephemeral: true,
                fetchReply: true
            });
        });

        it("Does not defer after reply", async () => {
            const { interaction } = getCommandInteraction();

            const commandRequest = new InteractionCommandRequest({} as Command, {} as Translator, interaction);
            await commandRequest.reply("test");
            await commandRequest.deferReply(false);

            expect(interaction.deferReply).not.called;
        });
    });

    // describe(`#${InteractionCommandRequest.prototype.reply.name}`, () => {
    //     it("Accept strings", async () => {
    //         const commandInteraction = {
    //             reply: sinon.stub().resolves()
    //         };
    //         const commandRequest = new InteractionCommandRequest({} as Command, {} as Translator, commandInteraction as unknown as CommandInteraction);
    //         await commandRequest.reply("test");
    //         expect(commandInteraction.reply).calledOnceWithExactly({
    //             ephemeral: true,
    //             content: "test",
    //             fetchReply: true
    //         });
    //     });

    //     it("Respect ephemeral and ignore fetchReply", async () => {
    //         const commandInteraction = {
    //             reply: sinon.stub().resolves()
    //         };
    //         const commandRequest = new InteractionCommandRequest({} as Command, {} as Translator, commandInteraction as unknown as CommandInteraction);
    //         await commandRequest.reply({
    //             ephemeral: false,
    //             content: "test",
    //             fetchReply: false
    //         });
    //         expect(commandInteraction.reply).calledOnceWithExactly({
    //             ephemeral: false,
    //             content: "test",
    //             fetchReply: true
    //         });
    //     });

    //     it("Should use followUp instead of reply after defer", async () => {
    //         const commandInteraction = {
    //             deferReply: sinon.stub().resolves({
    //                 flags: new BitField(MessageFlags.Loading)
    //             }),
    //             followUp: sinon.stub().resolves()
    //         };
    //         const commandRequest = new InteractionCommandRequest({} as Command, {} as Translator, commandInteraction as unknown as CommandInteraction);
    //         await commandRequest.deferReply();
    //         await commandRequest.reply("test");
    //         expect(commandInteraction.deferReply).calledOnceWithExactly({
    //             ephemeral: true,
    //             fetchReply: true
    //         });
    //         expect(commandInteraction.followUp).calledOnceWithExactly("test");
    //     });

    //     describe("Synchronization", () => {
    //         it("defer + defer", () => {

    //         });

    //         it("defer + reply", () => {

    //         });

    //         it("reply + defer", () => {

    //         });

    //         it("reply + reply", () => {

    //         });
    //     });

    //     describe("Handle more than 1 reply at once", () => {
    //         it("reply => reply", async () => {
    //             let resolveMessage: (value: unknown) => void;

    //             const commandInteraction = {
    //                 reply: sinon.stub().returns(new Promise(resolve => resolveMessage = resolve)),
    //                 editReply: sinon.stub().resolves()
    //             };
    //             const commandRequest = new InteractionCommandRequest({} as Command, {} as Translator, commandInteraction as unknown as CommandInteraction);
            
    //             const promise1 = commandRequest.reply("test");
    //             const promise2 = commandRequest.reply("test2");
    //             resolveMessage!({
    //                 flags: new BitField()
    //             });
    //             await Promise.all([promise1, promise2]);
            
    //             expect(commandInteraction.reply).calledOnceWithExactly({
    //                 content: 'test',
    //                 ephemeral: true,
    //                 fetchReply: true
    //             });
    //             expect(commandInteraction.editReply).calledOnceWithExactly("test2");
    //         });

    //         it("deferReply => reply", async () => {
    //             let resolveMessage: (value: unknown) => void;

    //             const commandInteraction = {
    //                 deferReply: sinon.stub().returns(new Promise(resolve => resolveMessage = resolve)),
    //                 followUp: sinon.stub().resolves()
    //             };
    //             const commandRequest = new InteractionCommandRequest({} as Command, {} as Translator, commandInteraction as unknown as CommandInteraction);

    //             const promise1 = commandRequest.deferReply();
    //             const promise2 = commandRequest.reply("test");
    //             resolveMessage!({
    //                 flags: new BitField(MessageFlags.Loading)
    //             });
    //             await Promise.all([promise1, promise2]);

    //             expect(commandInteraction.deferReply).calledOnceWithExactly({
    //                 ephemeral: true,
    //                 fetchReply: true
    //             });
    //             expect(commandInteraction.followUp).calledOnceWithExactly("test");
    //         });
    //     });
    // });

    // it(`#${InteractionCommandRequest.prototype.sendSeparate.name}`, async () => {
    //     const commandInteraction = {
    //         channel: {
    //             send: sinon.stub().resolves()
    //         }
    //     };
    //     const commandRequest = new InteractionCommandRequest({} as Command, {} as Translator, commandInteraction as unknown as CommandInteraction);
    //     await commandRequest.sendSeparate("test");
    //     expect(commandInteraction.channel.send).calledOnceWithExactly("test");
    // });
});
