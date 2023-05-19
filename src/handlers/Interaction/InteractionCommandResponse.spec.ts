import { expect } from "chai";
import { CommandInteraction } from "discord.js";
import { InteractionCommandResponse } from "./InteractionCommandResponse.js";
import { getCommandInteraction } from "./testData/getCommandInteraction.js";

describe(InteractionCommandResponse.name, () => {
    describe(`#${InteractionCommandResponse.prototype.replyOrEdit.name}`, () => {
        describe("Respect loading state of message", async () => {
            let interaction: CommandInteraction;

            beforeEach(() => {
                interaction = getCommandInteraction().interaction;
            });

            it("Reply and edit", async () => {
                const commandResponse = new InteractionCommandResponse(interaction as unknown as CommandInteraction);
                await commandResponse.replyOrEdit("test");
                await commandResponse.replyOrEdit("test");
                expect(interaction.reply).calledOnce;
                expect(interaction.editReply).calledOnce;
            });
            
            it("Defer and reply", async () => {
                const commandResponse = new InteractionCommandResponse(interaction as unknown as CommandInteraction);
                await commandResponse.deferReply();
                await commandResponse.replyOrEdit("test");
                expect(interaction.deferReply).calledOnce;
                expect(interaction.followUp).calledOnce;
            });
        });
    });
});
