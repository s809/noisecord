import { expect } from "chai";
import { Client, Collection } from "discord.js";
import sinon from "sinon";
import { CommandFramework, CommandFrameworkOptions } from "..js";

const options: CommandFrameworkOptions = {
    commandRegistryOptions: {
        commandModuleDirectory: "./testData/commands/normal",
        contextMenuModuleDirectory: "./testData/contextMenuCommands/normal"
    },
    translationOptions: {
        translationFileDirectory: "./testData/translations/normal",
        defaultLocale: "en-US",
        getUserLanguage: async () => "en-US",
        getGuildLanguage: async () => "en-US",
    },
    messageCommands: {
        prefix: "!",
        ignorePermissionsFor: []
    }
};

describe("CommandFramework", () => {
    it("when client is not ready", async () => {
        const client = sinon.createStubInstance(Client, {
            isReady: false
        });

        const commandFramework = new CommandFramework(options);
        await commandFramework.init(client as unknown as Client);

        expect(client.once).calledOnce;
    });

    it("when client is ready", async () => {
        const client = {
            isReady: () => true,
            on: sinon.stub(),
            once: sinon.stub(),
            application: {
                commands: {
                    set: async () => new Collection()
                }
            }
        }

        const commandFramework = new CommandFramework(options);
        await commandFramework.init(client as unknown as Client);

        expect(client.once).not.called;
    });
});
