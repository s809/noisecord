import { ApplicationCommandType } from "discord.js";
import { defineContextMenuCommand } from "../../../definitions.js";

export default defineContextMenuCommand({
    key: "cm-message",
    type: ApplicationCommandType.Message,
    handler: () => { }
});
