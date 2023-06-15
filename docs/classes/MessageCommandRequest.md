[@s809/noisecord](../README.md) / [Exports](../modules.md) / MessageCommandRequest

# Class: MessageCommandRequest<InGuild\>

Command request data from a message.

## Type parameters

| Name | Type |
| :------ | :------ |
| `InGuild` | extends `boolean` = `boolean` |

## Hierarchy

- [`CommandRequest`](CommandRequest.md)<`InGuild`, [`MessageCommandResponse`](MessageCommandResponse.md)\>

  ↳ **`MessageCommandRequest`**

## Table of contents

### Properties

- [command](MessageCommandRequest.md#command)
- [message](MessageCommandRequest.md#message)
- [prefix](MessageCommandRequest.md#prefix)
- [response](MessageCommandRequest.md#response)
- [translator](MessageCommandRequest.md#translator)

### Accessors

- [author](MessageCommandRequest.md#author)
- [channel](MessageCommandRequest.md#channel)
- [channelId](MessageCommandRequest.md#channelid)
- [content](MessageCommandRequest.md#content)
- [guild](MessageCommandRequest.md#guild)
- [guildId](MessageCommandRequest.md#guildid)
- [member](MessageCommandRequest.md#member)

### Methods

- [inGuild](MessageCommandRequest.md#inguild)
- [replyOrEdit](MessageCommandRequest.md#replyoredit)

## Properties

### command

 `Readonly` **command**: [`Command`](../interfaces/Command-1.md)

#### Defined in

[src/handlers/Message/MessageCommandRequest.ts:13](https://github.com/s809/noisecord/blob/6d7ed8b/src/handlers/Message/MessageCommandRequest.ts#L13)

___

### message

 `Readonly` **message**: `Message`<`boolean`\>

#### Defined in

[src/handlers/Message/MessageCommandRequest.ts:13](https://github.com/s809/noisecord/blob/6d7ed8b/src/handlers/Message/MessageCommandRequest.ts#L13)

___

### prefix

 `Readonly` **prefix**: `string`

#### Inherited from

[CommandRequest](CommandRequest.md).[prefix](CommandRequest.md#prefix)

#### Defined in

[src/handlers/CommandRequest.ts:13](https://github.com/s809/noisecord/blob/6d7ed8b/src/handlers/CommandRequest.ts#L13)

___

### response

 `Readonly` **response**: [`MessageCommandResponse`](MessageCommandResponse.md)

Response object, which is filled when a command request is replied.

#### Inherited from

[CommandRequest](CommandRequest.md).[response](CommandRequest.md#response)

#### Defined in

[src/handlers/CommandRequest.ts:15](https://github.com/s809/noisecord/blob/6d7ed8b/src/handlers/CommandRequest.ts#L15)

___

### translator

 `Readonly` **translator**: [`Translator`](Translator-1.md)

#### Inherited from

[CommandRequest](CommandRequest.md).[translator](CommandRequest.md#translator)

#### Defined in

[src/handlers/CommandRequest.ts:12](https://github.com/s809/noisecord/blob/6d7ed8b/src/handlers/CommandRequest.ts#L12)

## Accessors

### author

`get` **author**(): `User`

#### Returns

`User`

#### Overrides

CommandRequest.author

#### Defined in

[src/handlers/Message/MessageCommandRequest.ts:42](https://github.com/s809/noisecord/blob/6d7ed8b/src/handlers/Message/MessageCommandRequest.ts#L42)

___

### channel

`get` **channel**(): `If`<`InGuild`, `GuildTextBasedChannel`, `TextBasedChannel`\>

#### Returns

`If`<`InGuild`, `GuildTextBasedChannel`, `TextBasedChannel`\>

#### Overrides

CommandRequest.channel

#### Defined in

[src/handlers/Message/MessageCommandRequest.ts:30](https://github.com/s809/noisecord/blob/6d7ed8b/src/handlers/Message/MessageCommandRequest.ts#L30)

___

### channelId

`get` **channelId**(): `string`

#### Returns

`string`

#### Inherited from

CommandRequest.channelId

#### Defined in

[src/handlers/CommandRequest.ts:25](https://github.com/s809/noisecord/blob/6d7ed8b/src/handlers/CommandRequest.ts#L25)

___

### content

`get` **content**(): `string`

#### Returns

`string`

#### Defined in

[src/handlers/Message/MessageCommandRequest.ts:22](https://github.com/s809/noisecord/blob/6d7ed8b/src/handlers/Message/MessageCommandRequest.ts#L22)

___

### guild

`get` **guild**(): `If`<`InGuild`, `Guild`, ``null``\>

#### Returns

`If`<`InGuild`, `Guild`, ``null``\>

#### Overrides

CommandRequest.guild

#### Defined in

[src/handlers/Message/MessageCommandRequest.ts:34](https://github.com/s809/noisecord/blob/6d7ed8b/src/handlers/Message/MessageCommandRequest.ts#L34)

___

### guildId

`get` **guildId**(): `If`<`InGuild`, `string`\>

#### Returns

`If`<`InGuild`, `string`\>

#### Inherited from

CommandRequest.guildId

#### Defined in

[src/handlers/CommandRequest.ts:31](https://github.com/s809/noisecord/blob/6d7ed8b/src/handlers/CommandRequest.ts#L31)

___

### member

`get` **member**(): `If`<`InGuild`, `GuildMember`, ``null``\>

#### Returns

`If`<`InGuild`, `GuildMember`, ``null``\>

#### Overrides

CommandRequest.member

#### Defined in

[src/handlers/Message/MessageCommandRequest.ts:38](https://github.com/s809/noisecord/blob/6d7ed8b/src/handlers/Message/MessageCommandRequest.ts#L38)

## Methods

### inGuild

**inGuild**(): this is MessageCommandRequest<true\>

#### Returns

this is MessageCommandRequest<true\>

#### Overrides

[CommandRequest](CommandRequest.md).[inGuild](CommandRequest.md#inguild)

#### Defined in

[src/handlers/Message/MessageCommandRequest.ts:26](https://github.com/s809/noisecord/blob/6d7ed8b/src/handlers/Message/MessageCommandRequest.ts#L26)

___

### replyOrEdit

**replyOrEdit**(`options`): `Promise`<[`MessageCommandResponse`](MessageCommandResponse.md)\>

Replies to the command.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `string` \| `MessageReplyOptions` |

#### Returns

`Promise`<[`MessageCommandResponse`](MessageCommandResponse.md)\>

#### Overrides

[CommandRequest](CommandRequest.md).[replyOrEdit](CommandRequest.md#replyoredit)

#### Defined in

[src/handlers/Message/MessageCommandRequest.ts:18](https://github.com/s809/noisecord/blob/6d7ed8b/src/handlers/Message/MessageCommandRequest.ts#L18)
