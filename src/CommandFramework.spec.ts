import { expect } from "chai";
import { Client, Collection } from "discord.js";
import sinon from "sinon";
import { CommandFramework, CommandFrameworkOptions } from "./index.js";
import { testInitCheck } from "./testData/initCheck.js";

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
        this.timeout(10000);

        const client = sinon.createStubInstance(Client, {
            isReady: false
        });

        await CommandFramework.create(client as unknown as Client, options);

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

        await CommandFramework.create(client as unknown as Client, options);

        expect(client.once).not.called;
    });

    testInitCheck(() => new CommandFramework(sinon.createStubInstance(Client, {
        isReady: false
    }) as unknown as Client, options), [
        "commands",
        "commandRegistry",
        "translatorManager"
    ], instance => instance.init());
});
