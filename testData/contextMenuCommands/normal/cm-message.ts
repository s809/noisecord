import { ApplicationCommandType } from "discord.js";
import { ContextMenuCommandDefinition, defineCommand } from "../../../definitions.js";

export default defineCommand<ContextMenuCommandDefinition>({
    key: "cm-message",
    type: ApplicationCommandType.Message,
    handler: () => { }
});
