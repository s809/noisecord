import { ApplicationCommandOptionType } from "discord.js";
import { defineCommand } from "../../../../definitions.js";

export default defineCommand({
    key: "test",
    args: [{
        key: "arg",
        type: ApplicationCommandOptionType.String
    }, {
        key: "arg2",
        type: ApplicationCommandOptionType.String,
        choices: [{
            key: "test",
            value: "test2"
        }, {
            key: "test",
            value: "test3"
        }]
    }] as const,
    handler: (req, args) => { },
});
