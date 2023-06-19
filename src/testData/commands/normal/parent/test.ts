import { ApplicationCommandOptionType } from "discord.js";
import { defineCommand } from "../../../../index.js";

export default defineCommand({
    key: "test",
    args: [{
        key: "arg",
        type: ApplicationCommandOptionType.String
    }, {
        key: "arg2",
        type: ApplicationCommandOptionType.String,
        extras: true
    }] as const,
    handler: (req, args) => { },
});
