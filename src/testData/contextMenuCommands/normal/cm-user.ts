import { ApplicationCommandType } from "discord.js";
import { ContextMenuCommandDefinition, defineCommand } from "../../../definitions.js";

export default defineCommand<ContextMenuCommandDefinition>({
    key: "cm-user",
    type: ApplicationCommandType.User,
    handler: () => { }
});
