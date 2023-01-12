import assert from "assert";
import { BitField, CommandInteraction, Message, MessageFlags } from "discord.js";
import sinon from "sinon";
import { InteractionCommandResponse } from "./InteractionCommandResponse";

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
                const message = {
                    flags: new BitField([MessageFlags.Loading])
                };

                const commandResponse = new InteractionCommandResponse(interaction as unknown as CommandInteraction, message as Message);
                commandResponse.edit("test");
                assert(interaction.followUp.calledOnce);
                assert(interaction.editReply.notCalled);
            });
            
            it("Not loading", async () => {
                const message = {
                    flags: new BitField()
                };

                const commandResponse = new InteractionCommandResponse(interaction as unknown as CommandInteraction, message as Message);
                commandResponse.edit("test");
                assert(interaction.followUp.notCalled);
                assert(interaction.editReply.calledOnce);
            });
        });
    });
});
