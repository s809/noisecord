import { ApplicationCommandType } from "discord.js";
import { defineContextMenuCommand } from "../../../definitions.js";

export default defineContextMenuCommand({
    key: "cm-user",
    type: ApplicationCommandType.User,
    handler: () => { }
});
