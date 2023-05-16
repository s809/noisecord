import { expect } from "chai";
import { BitField, CommandInteraction, Message, MessageFlags } from "discord.js";
import sinon from "sinon";
import { InteractionCommandResponse } from "./InteractionCommandResponse.js";

describe(InteractionCommandResponse.name, () => {
    describe(`#${InteractionCommandResponse.prototype.edit.name}`, () => {
        describe("Respect loading state of message", async () => {
            let interaction: {
                followUp: sinon.SinonStub;
                editReply: sinon.SinonStub;
            };

            beforeEach(() => {
                interaction = {
                    followUp: sinon.stub(),
                    editReply: sinon.stub()
                };
            });

            it("Loading", async () => {
                const message = Promise.resolve({
                    flags: new BitField([MessageFlags.Loading])
                } as Message);

                const commandResponse = new InteractionCommandResponse(interaction as unknown as CommandInteraction, message);
                await commandResponse.edit("test");
                expect(interaction.followUp).calledOnce;
                expect(interaction.editReply).not.called;
            });
            
            it("Not loading", async () => {
                const message = Promise.resolve({
                    flags: new BitField()
                } as Message);

                const commandResponse = new InteractionCommandResponse(interaction as unknown as CommandInteraction, message);
                await commandResponse.edit("test");
                expect(interaction.followUp).not.called;
                expect(interaction.editReply).calledOnce;
            });
        });
    });
});
