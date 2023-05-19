import { expect } from "chai";
import { Command } from "../definitions.js";
import { Translator } from "../Translator.js";
import { InteractionCommandRequest } from "./InteractionCommandRequest.js";
import { getCommandInteraction } from "./testData/index.js";

describe(InteractionCommandRequest.name, () => {
    describe(`#${InteractionCommandRequest.prototype.completeSilently.name}`, () => {
        describe("Defer only if possible", async () => {
            it("Deferred", async () => {
                const { interaction } = getCommandInteraction();
                await interaction.deferReply();

                const commandRequest = new InteractionCommandRequest({} as Command, {} as Translator, interaction);
                await commandRequest.completeSilently();

                expect(interaction.deferReply).calledOnce;
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
});
