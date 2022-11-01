import { ApplicationCommandData, MessageContextMenuCommandInteraction, Snowflake, UserContextMenuCommandInteraction } from "discord.js";
import { pathToFileURL } from "url";
import { PrefixedTranslator, Translator } from "./Translator";
import { importModules } from "./importHelper";

var commands = new Map<Snowflake, ContextMenuCommand>();

type ContextMenuCommandInteractions = UserContextMenuCommandInteraction | MessageContextMenuCommandInteraction;
export interface ContextMenuCommandDefinition<T extends ContextMenuCommandInteractions = ContextMenuCommandInteractions> {
    key: string;
    type: T["commandType"];
    handler: (interaction: T, translator: PrefixedTranslator) => void;
}

export interface ContextMenuCommand<T extends ContextMenuCommandInteractions = ContextMenuCommandInteractions> extends ContextMenuCommandDefinition<T> {
    appCommandId: Snowflake | null;
    appCommandData: ApplicationCommandData;
}

export async function getContextMenuCommands(): Promise<ContextMenuCommand[]> {
    if (commands.size)
        return [...commands.values()];

    const definitions = await importModules<ContextMenuCommandDefinition>(pathToFileURL(botDirectory + "/contextMenuCommands/foo").toString());
    return definitions.map(([, definition]) => {
        const nameLocalizations = Translator.getLocalizations(`contextMenuCommands.${definition.key}.name`);
        if (!nameLocalizations[defaults.locale])
            throw new Error(`Context menu command ${definition.key} has no name in default locale.`);
        
        return {
            ...definition,
            appCommandId: null,
            appCommandData: {
                type: definition.type,
                name: nameLocalizations[defaults.locale],
                nameLocalizations,
                dmPermission: false
            }
        };
    });
}

export function setContextMenuCommands(items: ContextMenuCommand[]) {
    commands = new Map(items.map(command => [command.appCommandId!, command]));
}

export function resolveContextMenuCommand(id: Snowflake) {
    return commands.get(id);
}
