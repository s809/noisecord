[@s809/noisecord](../README.md) / [Exports](../modules.md) / InteractionCommandRequest

# Class: InteractionCommandRequest<CommandType, InteractionType\>

Command request data from an interaction.

## Type parameters

| Name | Type |
| :------ | :------ |
| `CommandType` | extends [`Command`](../interfaces/Command-1.md) \| [`ContextMenuCommand`](../interfaces/ContextMenuCommand.md) |
| `InteractionType` | extends `CommandInteraction` |

## Hierarchy

- [`CommandRequest`](CommandRequest.md)<`InteractionType` extends `CommandInteraction`<[`InGuildCacheType`](../modules.md#inguildcachetype)\> ? ``true`` : ``false``, [`InteractionCommandResponse`](InteractionCommandResponse.md)\>

  ↳ **`InteractionCommandRequest`**

## Table of contents

### Properties

- [command](InteractionCommandRequest.md#command)
- [interaction](InteractionCommandRequest.md#interaction)
- [prefix](InteractionCommandRequest.md#prefix)
- [response](InteractionCommandRequest.md#response)
- [translator](InteractionCommandRequest.md#translator)

### Accessors

- [author](InteractionCommandRequest.md#author)
- [channel](InteractionCommandRequest.md#channel)
- [channelId](InteractionCommandRequest.md#channelid)
- [guild](InteractionCommandRequest.md#guild)
- [guildId](InteractionCommandRequest.md#guildid)
- [member](InteractionCommandRequest.md#member)

### Methods

- [deferReply](InteractionCommandRequest.md#deferreply)
- [followUpForce](InteractionCommandRequest.md#followupforce)
- [inGuild](InteractionCommandRequest.md#inguild)
- [replyOrEdit](InteractionCommandRequest.md#replyoredit)

## Properties

### command

 `Readonly` **command**: `CommandType`

#### Defined in

[src/handlers/Interaction/InteractionCommandRequest.ts:22](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandRequest.ts#L22)

___

### interaction

 `Readonly` **interaction**: `InteractionType`

#### Defined in

[src/handlers/Interaction/InteractionCommandRequest.ts:22](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandRequest.ts#L22)

___

### prefix

 `Readonly` **prefix**: `string`

#### Inherited from

[CommandRequest](CommandRequest.md).[prefix](CommandRequest.md#prefix)

#### Defined in

[src/handlers/CommandRequest.ts:14](https://github.com/s809/noisecord/blob/master/src/handlers/CommandRequest.ts#L14)

___

### response

 `Readonly` **response**: [`InteractionCommandResponse`](InteractionCommandResponse.md)

Response object, which is filled when a command request is replied.

#### Inherited from

[CommandRequest](CommandRequest.md).[response](CommandRequest.md#response)

#### Defined in

[src/handlers/CommandRequest.ts:16](https://github.com/s809/noisecord/blob/master/src/handlers/CommandRequest.ts#L16)

___

### translator

 `Readonly` **translator**: [`Translator`](Translator-1.md)

#### Inherited from

[CommandRequest](CommandRequest.md).[translator](CommandRequest.md#translator)

#### Defined in

[src/handlers/CommandRequest.ts:13](https://github.com/s809/noisecord/blob/master/src/handlers/CommandRequest.ts#L13)

## Accessors

### author

`get` **author**(): `User`

#### Returns

`User`

#### Overrides

CommandRequest.author

#### Defined in

[src/handlers/Interaction/InteractionCommandRequest.ts:61](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandRequest.ts#L61)

___

### channel

`get` **channel**(): `If`<[`InteractionInGuild`](../modules.md#interactioninguild)<`InteractionType`\>, `GuildTextBasedChannel`, `TextBasedChannel`\>

#### Returns

`If`<[`InteractionInGuild`](../modules.md#interactioninguild)<`InteractionType`\>, `GuildTextBasedChannel`, `TextBasedChannel`\>

#### Overrides

CommandRequest.channel

#### Defined in

[src/handlers/Interaction/InteractionCommandRequest.ts:49](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandRequest.ts#L49)

___

### channelId

`get` **channelId**(): `string`

#### Returns

`string`

#### Inherited from

CommandRequest.channelId

#### Defined in

[src/handlers/CommandRequest.ts:26](https://github.com/s809/noisecord/blob/master/src/handlers/CommandRequest.ts#L26)

___

### guild

`get` **guild**(): `If`<[`InteractionInGuild`](../modules.md#interactioninguild)<`InteractionType`\>, `Guild`, ``null``\>

#### Returns

`If`<[`InteractionInGuild`](../modules.md#interactioninguild)<`InteractionType`\>, `Guild`, ``null``\>

#### Overrides

CommandRequest.guild

#### Defined in

[src/handlers/Interaction/InteractionCommandRequest.ts:53](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandRequest.ts#L53)

___

### guildId

`get` **guildId**(): `If`<`InGuild`, `string`\>

#### Returns

`If`<`InGuild`, `string`\>

#### Inherited from

CommandRequest.guildId

#### Defined in

[src/handlers/CommandRequest.ts:32](https://github.com/s809/noisecord/blob/master/src/handlers/CommandRequest.ts#L32)

___

### member

`get` **member**(): `If`<[`InteractionInGuild`](../modules.md#interactioninguild)<`InteractionType`\>, `GuildMember`, ``null``\>

#### Returns

`If`<[`InteractionInGuild`](../modules.md#interactioninguild)<`InteractionType`\>, `GuildMember`, ``null``\>

#### Overrides

CommandRequest.member

#### Defined in

[src/handlers/Interaction/InteractionCommandRequest.ts:57](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandRequest.ts#L57)

## Methods

### deferReply

**deferReply**(`ephemeral?`): `Promise`<[`InteractionCommandResponse`](InteractionCommandResponse.md)\>

Defers the reply, if possible.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `ephemeral` | `boolean` | `true` |

#### Returns

`Promise`<[`InteractionCommandResponse`](InteractionCommandResponse.md)\>

#### Defined in

[src/handlers/Interaction/InteractionCommandRequest.ts:28](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandRequest.ts#L28)

___

### followUpForce

**followUpForce**(`options`): `Promise`<`Message`<[`InteractionInGuild`](../modules.md#interactioninguild)<`InteractionType`\>\>\>

Sends a follow up message.
If interaction is not replied to fully, throws an error.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`Translatable`](../modules.md#translatable)<`string` \| `InteractionReplyOptions`\> |

#### Returns

`Promise`<`Message`<[`InteractionInGuild`](../modules.md#interactioninguild)<`InteractionType`\>\>\>

#### Defined in

[src/handlers/Interaction/InteractionCommandRequest.ts:41](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandRequest.ts#L41)

___

### inGuild

**inGuild**(): this is InteractionCommandRequest<CommandType, CommandInteraction<"cached" \| "raw"\>\>

#### Returns

this is InteractionCommandRequest<CommandType, CommandInteraction<"cached" \| "raw"\>\>

#### Overrides

[CommandRequest](CommandRequest.md).[inGuild](CommandRequest.md#inguild)

#### Defined in

[src/handlers/Interaction/InteractionCommandRequest.ts:45](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandRequest.ts#L45)

___

### replyOrEdit

**replyOrEdit**(`options`): `Promise`<[`InteractionCommandResponse`](InteractionCommandResponse.md)\>

Replies to the command.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`Translatable`](../modules.md#translatable)<`string` \| `InteractionEditReplyOptions` \| `InteractionReplyOptions`\> |

#### Returns

`Promise`<[`InteractionCommandResponse`](InteractionCommandResponse.md)\>

#### Overrides

[CommandRequest](CommandRequest.md).[replyOrEdit](CommandRequest.md#replyoredit)

#### Defined in

[src/handlers/Interaction/InteractionCommandRequest.ts:33](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandRequest.ts#L33)
