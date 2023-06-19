import { CommandFramework } from "@s809/noisecord";
import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
    // Intents below are critical for receiving message commands;
    // Message content intent must be enabled in Discord developer portal.
    // Note: if you choose the bot's mention as prefix, you can delete the last intent from line below.
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

(async () => {
    await CommandFramework.create(client, {
        commandRegistryOptions: {
            // In TypeScript, property below should point to within a directory with build output
            commandModuleDirectory: "./build/commands"
        },

        // If you don't need interaction/message commands, simply remove the matching property.
        interactionCommands: {
            // It has no required properties, but is used to enable interaction commands.
        },
        messageCommands: {
            prefix: "!"
        }
    });

    // Create your client anywhere before this line
    await client.login("token");
})();
