import { expect } from "chai";
import { Client, Collection } from "discord.js";
import sinon from "sinon";
import { CommandFramework, CommandFrameworkOptions } from "./index.js";

const options: CommandFrameworkOptions = {
    commandRegistryOptions: {
        commandModuleDirectory: "./src/testData/commands/normal",
        contextMenuModuleDirectory: "./src/testData/contextMenuCommands/normal"
    },
    translationOptions: {
        translationFileDirectory: "./src/testData/translations/normal",
        defaultLocale: "en-US",
        getUserLocale: async () => "en-US",
        getGuildLocale: async () => "en-US",
    },
    messageCommands: {
        prefix: "!",
        ignoreAllPermissionsFor: [],
        ignoreOwnerOnlyFor: []
    }
};

describe("CommandFramework", () => {
    it("when client is not ready", async function () {
        this.timeout(5000);

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
