@s809/noisecord / [Exports](modules.md)

# noisecord

## Installing
1. Create `.npmrc` in your project root with following contents:
```npmrc
@s809:registry=https://npm.pkg.github.com/
```
2. Log into GitHub using instructions [here](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token).
3. Then you can run:
```shell
npm install @s809/noisecord
```

## Example
To create a simple bot, use the following code:

- `main.ts`:
```ts
import { CommandFramework } from "@s809/noisecord";

const commandFramework = await CommandFramework.create(client, {
    commandRegistryOptions: {
        // If you're using TypeScript, property below should point to a directory with build output;
        // For example, you'll need to replace "./commands" with "./build/commands".
        commandModuleDirectory: "./commands"
    },

    // If you don't need interaction/message commands, simply remove the matching property.
    interactionCommands: {
        // It has no required properties, but is required for interaction commands (slash/right click) to work.
    },
    messageCommands: {
        prefix: "!"
    }
});

// Create your client anywhere before this line
await client.login(token);
```

- `commands/ping.ts`
```ts
import { defineCommand } from "@s809/noisecord";

export default defineCommand({
    key: "ping",
    handler: req => req.reply("Pong!")
});
```

## Documentation
To jump right into it, [click here](./docs/modules.md).
