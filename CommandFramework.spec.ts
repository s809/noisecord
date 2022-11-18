import assert from "assert";
import { Client, Collection } from "discord.js";
import sinon from "sinon";
import { CommandFramework, CommandFrameworkOptions } from ".";

const options: CommandFrameworkOptions = {
    commandRegistryOptions: {
        commandModuleDirectory: "./testData/normal/commands",
        contextMenuModuleDirectory: "./testData/normal/contextMenuCommands"
    },
    translationOptions: {
        translationFileDirectory: "./testData/normal/translations",
        defaultLocale: "en-US",
        getUserLanguage: async () => "en-US",
        getGuildLanguage: async () => "en-US",
    }
};

describe("CommandFramework", () => {
    it("when client is not ready", async () => {
        const client = sinon.createStubInstance(Client, {
            isReady: false
        });

        const commandFramework = new CommandFramework(options);
        await commandFramework.init(client as unknown as Client);

        assert(client.once.calledOnce);
    });

    it("when client is ready", async () => {
        const client = {
            isReady: () => true,
            once: sinon.stub(),
            application: {
                commands: {
                    set: async () => new Collection()
                }
            }
        }

        const commandFramework = new CommandFramework(options);
        await commandFramework.init(client as unknown as Client);

        assert(client.once.notCalled);
    });
});
