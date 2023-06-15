[@s809/noisecord](README.md) / Exports

# @s809/noisecord

Command framework.

**`Example`**

To create a simple bot, use the following code:

- index.ts:
```
import { CommandFramework } from "@s809/noisecord";

const commandFramework = CommandFramework.create(client, {
    commandRegistryOptions: {
        // If you're using TypeScript, properties below should point to a directory with build output;
        // Otherwise you'll want to remove "build/" parts.
        commandModuleDirectory: "./build/commands"
    },

    translationOptions: {
        translationFileDirectory: "./translations",
        defaultLocale: "en-US",
        getUserLocale: () => "en-US",
        getGuildLocale:  () => "en-US",
    },

    // If you don't need interaction/message commands, simply remove the matching property.
    interactionCommands: {
        // It has no required properties, but is required for interaction commands (slash/right click) to work.
    },
    messageCommands: {
        prefix: "!"
    }
});

// Create your client anywhere before next line
await client.login(token);
```

- commands/mycommand.ts
```
import { defineCommand } from "@s809/noisecord";

export default defineCommand({
    key: "ping",
    handler: req => req.reply("Pong!");
});
```

## Table of contents

### Namespaces

- [ArgumentParseError](modules/ArgumentParseError.md)
- [Command](modules/Command.md)
- [CommandCondition](modules/CommandCondition.md)
- [CommandDefinition](modules/CommandDefinition.md)
- [ContextMenuCommandDefinition](modules/ContextMenuCommandDefinition.md)
- [EventHandler](modules/EventHandler.md)
- [TranslationChecker](modules/TranslationChecker.md)
- [Translator](modules/Translator.md)
- [TranslatorManager](modules/TranslatorManager.md)

### Classes

- [AllLocalesPathTranslator](classes/AllLocalesPathTranslator.md)
- [ArgumentParseError](classes/ArgumentParseError-1.md)
- [CommandFramework](classes/CommandFramework.md)
- [CommandRegistry](classes/CommandRegistry.md)
- [CommandRequest](classes/CommandRequest.md)
- [CommandResponse](classes/CommandResponse.md)
- [DefaultLocalePathTranslator](classes/DefaultLocalePathTranslator.md)
- [ErrorCollector](classes/ErrorCollector.md)
- [EventHandler](classes/EventHandler-1.md)
- [InteractionCommandRequest](classes/InteractionCommandRequest.md)
- [InteractionCommandResponse](classes/InteractionCommandResponse.md)
- [MessageCommandRequest](classes/MessageCommandRequest.md)
- [MessageCommandResponse](classes/MessageCommandResponse.md)
- [TranslationChecker](classes/TranslationChecker-1.md)
- [Translator](classes/Translator-1.md)
- [TranslatorManager](classes/TranslatorManager-1.md)

### Interfaces

- [Command](interfaces/Command-1.md)
- [CommandCondition](interfaces/CommandCondition-1.md)
- [CommandDefinition](interfaces/CommandDefinition-1.md)
- [CommandFrameworkOptions](interfaces/CommandFrameworkOptions.md)
- [CommandRegistryOptions](interfaces/CommandRegistryOptions.md)
- [ContextMenuCommand](interfaces/ContextMenuCommand.md)
- [ContextMenuCommandDefinition](interfaces/ContextMenuCommandDefinition-1.md)
- [EventHandlerOptions](interfaces/EventHandlerOptions.md)
- [InteractionHandlerOptions](interfaces/InteractionHandlerOptions.md)
- [MessageHandlerOptions](interfaces/MessageHandlerOptions.md)
- [TranslatorManagerOptions](interfaces/TranslatorManagerOptions.md)

### Type Aliases

- [AllowDMsCacheType](modules.md#allowdmscachetype)
- [AllowDMsInGuild](modules.md#allowdmsinguild)
- [DeeplyNestedMap](modules.md#deeplynestedmap)
- [DistributiveOmit](modules.md#distributiveomit)
- [InGuildCacheType](modules.md#inguildcachetype)
- [InteractionInGuild](modules.md#interactioninguild)
- [UnionToIntersectionRecursive](modules.md#uniontointersectionrecursive)

### Variables

- [failureEmoji](modules.md#failureemoji)
- [loadingEmoji](modules.md#loadingemoji)
- [successEmoji](modules.md#successemoji)
- [textChannels](modules.md#textchannels)

### Functions

- [defineCommand](modules.md#definecommand)
- [defineContextMenuCommand](modules.md#definecontextmenucommand)
- [parseChannelMention](modules.md#parsechannelmention)
- [parseMention](modules.md#parsemention)
- [parseRoleMention](modules.md#parserolemention)
- [parseUserMention](modules.md#parseusermention)

## Type Aliases

### AllowDMsCacheType

 **AllowDMsCacheType**<`AllowDMs`\>: [`InGuildCacheType`](modules.md#inguildcachetype)<`AllowDMs` extends ``true`` ? ``false`` : ``true``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `AllowDMs` | extends `boolean` |

#### Defined in

[src/interfaces/common.ts:4](https://github.com/s809/noisecord/blob/9cb1c4e/src/interfaces/common.ts#L4)

___

### AllowDMsInGuild

 **AllowDMsInGuild**<`AllowDMs`\>: `AllowDMs` extends ``true`` ? `boolean` : ``true``

#### Type parameters

| Name |
| :------ |
| `AllowDMs` |

#### Defined in

[src/interfaces/common.ts:13](https://github.com/s809/noisecord/blob/9cb1c4e/src/interfaces/common.ts#L13)

___

### DeeplyNestedMap

 **DeeplyNestedMap**<`V`\>: `Map`<`string`, `V` \| [`DeeplyNestedMap`](modules.md#deeplynestedmap)<`V`\>\>

#### Type parameters

| Name |
| :------ |
| `V` |

#### Defined in

[src/util.ts:90](https://github.com/s809/noisecord/blob/9cb1c4e/src/util.ts#L90)

___

### DistributiveOmit

 **DistributiveOmit**<`T`, `K`\>: `T` extends `any` ? `Omit`<`T`, `K`\> : `never`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `K` | extends keyof `any` |

#### Defined in

[src/util.ts:85](https://github.com/s809/noisecord/blob/9cb1c4e/src/util.ts#L85)

___

### InGuildCacheType

 **InGuildCacheType**<`InGuild`\>: `InGuild` extends ``true`` ? `Exclude`<`CacheType`, `undefined`\> : `CacheType`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `InGuild` | extends `boolean` = ``true`` |

#### Defined in

[src/interfaces/common.ts:7](https://github.com/s809/noisecord/blob/9cb1c4e/src/interfaces/common.ts#L7)

___

### InteractionInGuild

 **InteractionInGuild**<`T`\>: `T` extends `CommandInteraction`<[`InGuildCacheType`](modules.md#inguildcachetype)\> ? ``true`` : ``false``

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `CommandInteraction` |

#### Defined in

[src/interfaces/common.ts:10](https://github.com/s809/noisecord/blob/9cb1c4e/src/interfaces/common.ts#L10)

___

### UnionToIntersectionRecursive

 **UnionToIntersectionRecursive**<`T`\>: { [K in keyof T]: T[K] extends Object ? UnionToIntersection<T[K]\> : UnionToIntersectionRecursive<T[K]\> }

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/util.ts:93](https://github.com/s809/noisecord/blob/9cb1c4e/src/util.ts#L93)

## Variables

### failureEmoji

 `Const` **failureEmoji**: ``"❌"``

Default emote for failure state on a message command.

#### Defined in

[src/handlers/Message/MessageHandler.ts:30](https://github.com/s809/noisecord/blob/9cb1c4e/src/handlers/Message/MessageHandler.ts#L30)

___

### loadingEmoji

 `Const` **loadingEmoji**: ``"🔄"``

Default emote for loading state on a message command.

#### Defined in

[src/handlers/Message/MessageHandler.ts:18](https://github.com/s809/noisecord/blob/9cb1c4e/src/handlers/Message/MessageHandler.ts#L18)

___

### successEmoji

 `Const` **successEmoji**: ``"✅"``

Default emote for success state on a message command.

#### Defined in

[src/handlers/Message/MessageHandler.ts:24](https://github.com/s809/noisecord/blob/9cb1c4e/src/handlers/Message/MessageHandler.ts#L24)

___

### textChannels

 `Const` **textChannels**: (`GuildText` \| `GuildAnnouncement` \| `AnnouncementThread` \| `PublicThread` \| `PrivateThread`)[]

#### Defined in

[src/interfaces/common.ts:16](https://github.com/s809/noisecord/blob/9cb1c4e/src/interfaces/common.ts#L16)

## Functions

### defineCommand

**defineCommand**<`OwnerOnly`, `AllowDMs`, `Args`\>(`definition`): [`CommandDefinition`](interfaces/CommandDefinition-1.md)<`OwnerOnly`, `AllowDMs`, `Args`\>

Allows to type check a command definition.

**`Example`**

```
export default defineCommand({
   key: "mycommand",

   ownerOnly: true,
   defaultMemberPermissions: PermissionFlagsBits.Administrator,
   conditions: InVoiceChannel,

   args: [{
       key: "num",
       type: ApplicationCommandOptionType.Number,
   }, {
       key: "extras",
       type: ApplicationCommandOptionType.String,
       isExtras: true,
   }],

   handler: async (req, { num, extras }) => {
       // implementation of mycommand goes here
   },
});
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `OwnerOnly` | extends `boolean` = ``false`` |
| `AllowDMs` | extends `boolean` = ``true`` |
| `Args` | extends readonly [`Argument`](modules/CommandDefinition.md#argument)[] = readonly [`Argument`](modules/CommandDefinition.md#argument)[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`CommandDefinition`](interfaces/CommandDefinition-1.md)<`OwnerOnly`, `AllowDMs`, `Args`\> |

#### Returns

[`CommandDefinition`](interfaces/CommandDefinition-1.md)<`OwnerOnly`, `AllowDMs`, `Args`\>

#### Defined in

[src/interfaces/Command.ts:142](https://github.com/s809/noisecord/blob/9cb1c4e/src/interfaces/Command.ts#L142)

___

### defineContextMenuCommand

**defineContextMenuCommand**<`InteractionType`, `AllowDMs`\>(`definition`): [`ContextMenuCommandDefinition`](interfaces/ContextMenuCommandDefinition-1.md)<`InteractionType`, `AllowDMs`\>

Allows to type check a context menu command definition.

**`Example`**

```
export default defineContextMenuCommand({
   key: "mycommand",

   type: ApplicationCommandType.Message,
   allowDMs: false,

   handler: async req => {
       // implementation of mycommand goes here
   }
});
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `InteractionType` | extends `User` \| `Message` |
| `AllowDMs` | extends `boolean` = ``true`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`ContextMenuCommandDefinition`](interfaces/ContextMenuCommandDefinition-1.md)<`InteractionType`, `AllowDMs`\> |

#### Returns

[`ContextMenuCommandDefinition`](interfaces/ContextMenuCommandDefinition-1.md)<`InteractionType`, `AllowDMs`\>

#### Defined in

[src/interfaces/ContextMenuCommand.ts:51](https://github.com/s809/noisecord/blob/9cb1c4e/src/interfaces/ContextMenuCommand.ts#L51)

___

### parseChannelMention

**parseChannelMention**(`text`): ``null`` \| `string`

Extracts channel ID from mention.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | Text containing mention. |

#### Returns

``null`` \| `string`

Extracted ID.

#### Defined in

[src/util.ts:51](https://github.com/s809/noisecord/blob/9cb1c4e/src/util.ts#L51)

___

### parseMention

**parseMention**(`text`, `prefix`): `string` \| ``null``

Extracts ID from mention.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | Text containing mention. |
| `prefix` | `string` | - |

#### Returns

`string` \| ``null``

Extracted ID.

#### Defined in

[src/util.ts:36](https://github.com/s809/noisecord/blob/9cb1c4e/src/util.ts#L36)

___

### parseRoleMention

**parseRoleMention**(`text`): ``null`` \| `string`

Extracts role ID from mention.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | Text containing mention. |

#### Returns

``null`` \| `string`

Extracted ID.

#### Defined in

[src/util.ts:73](https://github.com/s809/noisecord/blob/9cb1c4e/src/util.ts#L73)

___

### parseUserMention

**parseUserMention**(`text`): ``null`` \| `string`

Extracts user ID from mention.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | Text containing mention. |

#### Returns

``null`` \| `string`

Extracted ID.

#### Defined in

[src/util.ts:62](https://github.com/s809/noisecord/blob/9cb1c4e/src/util.ts#L62)
