[@s809/noisecord](../README.md) / [Exports](../modules.md) / CommandRequest

# Class: CommandRequest<InGuild, Response\>

Abstract instance of command related data.

## Type parameters

| Name | Type |
| :------ | :------ |
| `InGuild` | extends `boolean` = `boolean` |
| `Response` | extends [`CommandResponse`](CommandResponse.md) = [`CommandResponse`](CommandResponse.md) |

## Hierarchy

- **`CommandRequest`**

  ↳ [`InteractionCommandRequest`](InteractionCommandRequest.md)

  ↳ [`MessageCommandRequest`](MessageCommandRequest.md)

## Table of contents

### Properties

- [prefix](CommandRequest.md#prefix)
- [response](CommandRequest.md#response)
- [translator](CommandRequest.md#translator)

### Accessors

- [author](CommandRequest.md#author)
- [channel](CommandRequest.md#channel)
- [channelId](CommandRequest.md#channelid)
- [guild](CommandRequest.md#guild)
- [guildId](CommandRequest.md#guildid)
- [member](CommandRequest.md#member)

### Methods

- [inGuild](CommandRequest.md#inguild)
- [replyOrEdit](CommandRequest.md#replyoredit)

## Properties

### prefix

 `Readonly` **prefix**: `string`

#### Defined in

[src/handlers/CommandRequest.ts:14](https://github.com/s809/noisecord/blob/master/src/handlers/CommandRequest.ts#L14)

___

### response

 `Readonly` **response**: `Response`

Response object, which is filled when a command request is replied.

#### Defined in

[src/handlers/CommandRequest.ts:16](https://github.com/s809/noisecord/blob/master/src/handlers/CommandRequest.ts#L16)

___

### translator

 `Readonly` **translator**: [`Translator`](Translator-1.md)

#### Defined in

[src/handlers/CommandRequest.ts:13](https://github.com/s809/noisecord/blob/master/src/handlers/CommandRequest.ts#L13)

## Accessors

### author

`Abstract` `get` **author**(): `User`

#### Returns

`User`

#### Defined in

[src/handlers/CommandRequest.ts:38](https://github.com/s809/noisecord/blob/master/src/handlers/CommandRequest.ts#L38)

___

### channel

`Abstract` `get` **channel**(): `If`<`InGuild`, `GuildTextBasedChannel`, `TextBasedChannel`\>

#### Returns

`If`<`InGuild`, `GuildTextBasedChannel`, `TextBasedChannel`\>

#### Defined in

[src/handlers/CommandRequest.ts:24](https://github.com/s809/noisecord/blob/master/src/handlers/CommandRequest.ts#L24)

___

### channelId

`get` **channelId**(): `string`

#### Returns

`string`

#### Defined in

[src/handlers/CommandRequest.ts:26](https://github.com/s809/noisecord/blob/master/src/handlers/CommandRequest.ts#L26)

___

### guild

`Abstract` `get` **guild**(): `If`<`InGuild`, `Guild`\>

#### Returns

`If`<`InGuild`, `Guild`\>

#### Defined in

[src/handlers/CommandRequest.ts:30](https://github.com/s809/noisecord/blob/master/src/handlers/CommandRequest.ts#L30)

___

### guildId

`get` **guildId**(): `If`<`InGuild`, `string`\>

#### Returns

`If`<`InGuild`, `string`\>

#### Defined in

[src/handlers/CommandRequest.ts:32](https://github.com/s809/noisecord/blob/master/src/handlers/CommandRequest.ts#L32)

___

### member

`Abstract` `get` **member**(): `If`<`InGuild`, `GuildMember`\>

#### Returns

`If`<`InGuild`, `GuildMember`\>

#### Defined in

[src/handlers/CommandRequest.ts:36](https://github.com/s809/noisecord/blob/master/src/handlers/CommandRequest.ts#L36)

## Methods

### inGuild

`Abstract` **inGuild**(): this is CommandRequest<true, Response\>

#### Returns

this is CommandRequest<true, Response\>

#### Defined in

[src/handlers/CommandRequest.ts:22](https://github.com/s809/noisecord/blob/master/src/handlers/CommandRequest.ts#L22)

___

### replyOrEdit

`Abstract` **replyOrEdit**(`options`): `Promise`<`Response`\>

Replies to the command request.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`Translatable`](../modules.md#translatable)<`string` \| `InteractionReplyOptions` \| `MessageReplyOptions`\> |

#### Returns

`Promise`<`Response`\>

#### Defined in

[src/handlers/CommandRequest.ts:20](https://github.com/s809/noisecord/blob/master/src/handlers/CommandRequest.ts#L20)
