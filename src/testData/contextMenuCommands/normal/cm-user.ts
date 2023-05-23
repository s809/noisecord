import { ApplicationCommandType } from "discord.js";
import { defineContextMenuCommand } from "../../../index.js";

export default defineContextMenuCommand({
    key: "cm-user",
    type: ApplicationCommandType.User,
    handler: () => { }
});
