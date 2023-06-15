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

[src/handlers/CommandRequest.ts:13](https://github.com/s809/noisecord/blob/9cb1c4e/src/handlers/CommandRequest.ts#L13)

___

### response

 `Readonly` **response**: `Response`

Response object, which is filled when a command request is replied.

#### Defined in

[src/handlers/CommandRequest.ts:15](https://github.com/s809/noisecord/blob/9cb1c4e/src/handlers/CommandRequest.ts#L15)

___

### translator

 `Readonly` **translator**: [`Translator`](Translator-1.md)

#### Defined in

[src/handlers/CommandRequest.ts:12](https://github.com/s809/noisecord/blob/9cb1c4e/src/handlers/CommandRequest.ts#L12)

## Accessors

### author

`Abstract` `get` **author**(): `User`

#### Returns

`User`

#### Defined in

[src/handlers/CommandRequest.ts:37](https://github.com/s809/noisecord/blob/9cb1c4e/src/handlers/CommandRequest.ts#L37)

___

### channel

`Abstract` `get` **channel**(): `If`<`InGuild`, `GuildTextBasedChannel`, `TextBasedChannel`\>

#### Returns

`If`<`InGuild`, `GuildTextBasedChannel`, `TextBasedChannel`\>

#### Defined in

[src/handlers/CommandRequest.ts:23](https://github.com/s809/noisecord/blob/9cb1c4e/src/handlers/CommandRequest.ts#L23)

___

### channelId

`get` **channelId**(): `string`

#### Returns

`string`

#### Defined in

[src/handlers/CommandRequest.ts:25](https://github.com/s809/noisecord/blob/9cb1c4e/src/handlers/CommandRequest.ts#L25)

___

### guild

`Abstract` `get` **guild**(): `If`<`InGuild`, `Guild`\>

#### Returns

`If`<`InGuild`, `Guild`\>

#### Defined in

[src/handlers/CommandRequest.ts:29](https://github.com/s809/noisecord/blob/9cb1c4e/src/handlers/CommandRequest.ts#L29)

___

### guildId

`get` **guildId**(): `If`<`InGuild`, `string`\>

#### Returns

`If`<`InGuild`, `string`\>

#### Defined in

[src/handlers/CommandRequest.ts:31](https://github.com/s809/noisecord/blob/9cb1c4e/src/handlers/CommandRequest.ts#L31)

___

### member

`Abstract` `get` **member**(): `If`<`InGuild`, `GuildMember`\>

#### Returns

`If`<`InGuild`, `GuildMember`\>

#### Defined in

[src/handlers/CommandRequest.ts:35](https://github.com/s809/noisecord/blob/9cb1c4e/src/handlers/CommandRequest.ts#L35)

## Methods

### inGuild

`Abstract` **inGuild**(): this is CommandRequest<true, Response\>

#### Returns

this is CommandRequest<true, Response\>

#### Defined in

[src/handlers/CommandRequest.ts:21](https://github.com/s809/noisecord/blob/9cb1c4e/src/handlers/CommandRequest.ts#L21)

___

### replyOrEdit

`Abstract` **replyOrEdit**(`options`): `Promise`<`Response`\>

Replies to the command request.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `string` \| `InteractionReplyOptions` \| `MessageReplyOptions` |

#### Returns

`Promise`<`Response`\>

#### Defined in

[src/handlers/CommandRequest.ts:19](https://github.com/s809/noisecord/blob/9cb1c4e/src/handlers/CommandRequest.ts#L19)
