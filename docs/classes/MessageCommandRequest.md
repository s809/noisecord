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

[src/handlers/Message/MessageCommandRequest.ts:14](https://github.com/s809/noisecord/blob/master/src/handlers/Message/MessageCommandRequest.ts#L14)

___

### message

 `Readonly` **message**: `Message`<`boolean`\>

#### Defined in

[src/handlers/Message/MessageCommandRequest.ts:14](https://github.com/s809/noisecord/blob/master/src/handlers/Message/MessageCommandRequest.ts#L14)

___

### prefix

 `Readonly` **prefix**: `string`

#### Inherited from

[CommandRequest](CommandRequest.md).[prefix](CommandRequest.md#prefix)

#### Defined in

[src/handlers/CommandRequest.ts:14](https://github.com/s809/noisecord/blob/master/src/handlers/CommandRequest.ts#L14)

___

### response

 `Readonly` **response**: [`MessageCommandResponse`](MessageCommandResponse.md)

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

[src/handlers/Message/MessageCommandRequest.ts:43](https://github.com/s809/noisecord/blob/master/src/handlers/Message/MessageCommandRequest.ts#L43)

___

### channel

`get` **channel**(): `If`<`InGuild`, `GuildTextBasedChannel`, `TextBasedChannel`\>

#### Returns

`If`<`InGuild`, `GuildTextBasedChannel`, `TextBasedChannel`\>

#### Overrides

CommandRequest.channel

#### Defined in

[src/handlers/Message/MessageCommandRequest.ts:31](https://github.com/s809/noisecord/blob/master/src/handlers/Message/MessageCommandRequest.ts#L31)

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

### content

`get` **content**(): `string`

#### Returns

`string`

#### Defined in

[src/handlers/Message/MessageCommandRequest.ts:23](https://github.com/s809/noisecord/blob/master/src/handlers/Message/MessageCommandRequest.ts#L23)

___

### guild

`get` **guild**(): `If`<`InGuild`, `Guild`, ``null``\>

#### Returns

`If`<`InGuild`, `Guild`, ``null``\>

#### Overrides

CommandRequest.guild

#### Defined in

[src/handlers/Message/MessageCommandRequest.ts:35](https://github.com/s809/noisecord/blob/master/src/handlers/Message/MessageCommandRequest.ts#L35)

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

`get` **member**(): `If`<`InGuild`, `GuildMember`, ``null``\>

#### Returns

`If`<`InGuild`, `GuildMember`, ``null``\>

#### Overrides

CommandRequest.member

#### Defined in

[src/handlers/Message/MessageCommandRequest.ts:39](https://github.com/s809/noisecord/blob/master/src/handlers/Message/MessageCommandRequest.ts#L39)

## Methods

### inGuild

**inGuild**(): this is MessageCommandRequest<true\>

#### Returns

this is MessageCommandRequest<true\>

#### Overrides

[CommandRequest](CommandRequest.md).[inGuild](CommandRequest.md#inguild)

#### Defined in

[src/handlers/Message/MessageCommandRequest.ts:27](https://github.com/s809/noisecord/blob/master/src/handlers/Message/MessageCommandRequest.ts#L27)

___

### replyOrEdit

**replyOrEdit**(`options`): `Promise`<[`MessageCommandResponse`](MessageCommandResponse.md)\>

Replies to the command.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`Translatable`](../modules.md#translatable)<`string` \| `MessageCreateOptions` \| `MessageEditOptions` \| `InteractionEditReplyOptions` \| `InteractionReplyOptions`\> |

#### Returns

`Promise`<[`MessageCommandResponse`](MessageCommandResponse.md)\>

#### Overrides

[CommandRequest](CommandRequest.md).[replyOrEdit](CommandRequest.md#replyoredit)

#### Defined in

[src/handlers/Message/MessageCommandRequest.ts:19](https://github.com/s809/noisecord/blob/master/src/handlers/Message/MessageCommandRequest.ts#L19)
