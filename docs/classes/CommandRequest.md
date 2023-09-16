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
| `options` | `string` \| [`PreparedTranslation`](PreparedTranslation.md) \| { `allowedMentions?`: { parse?: (string \| PreparedTranslation)[] \| undefined; roles?: (string \| PreparedTranslation)[] \| undefined; users?: (string \| PreparedTranslation)[] \| undefined; repliedUser?: boolean \| undefined; } ; `components?`: ({ components: ({ custom\_id: string \| PreparedTranslation; label?: string \| PreparedTranslation \| undefined; style: ButtonStyle.Primary \| ButtonStyle.Secondary \| ButtonStyle.Success \| ButtonStyle.Danger; emoji?: { ...; } \| undefined; disabled?: boolean \| undefined; type: ComponentType.Button; } \| ... 5 more ... \| { .... \| { toJSON: {}; } \| { components: ({ toJSON: {}; } \| { style: ButtonStyle.Primary \| ButtonStyle.Secondary \| ButtonStyle.Success \| ButtonStyle.Danger; customId: string \| PreparedTranslation; type: ComponentType.Button; disabled?: boolean \| undefined; emoji?: string \| ... 2 more ... \| undefined; label?: string \| ... 1 more ... \| undefine...)[] ; `content?`: `string` \| [`PreparedTranslation`](PreparedTranslation.md) ; `embeds?`: ({ title?: string \| PreparedTranslation \| undefined; type?: string \| PreparedTranslation \| undefined; description?: string \| PreparedTranslation \| undefined; ... 9 more ...; fields?: { ...; }[] \| undefined; } \| { toJSON: {}; })[] ; `ephemeral?`: `boolean` ; `fetchReply?`: `boolean` ; `files?`: (`string` \| [`PreparedTranslation`](PreparedTranslation.md) \| { contentType: string \| PreparedTranslation \| null; description: string \| PreparedTranslation \| null; duration: number \| null; ephemeral: boolean; ... 10 more ...; toJSON: {}; } \| { [x: number]: number; write: {}; toString: {}; toJSON: {}; equals: {}; compare: {}; copy: {}; slice: {}; subarray: {}; writeBigInt64BE: {}; writeBigInt64LE: {}; writeBigUInt64BE: {}; writeBigUint64BE: {}; ... 96 more ...; readonly [Symbol.toStringTag]: string \| PreparedTranslation; } \| { pipe: {}; compose: {}; addListener: {}; on: {}; once: {}; removeListener: {}; off: {}; removeAllListeners: {}; setMaxListeners: {}; getMaxListeners: {}; listeners: {}; rawListeners: {}; emit: {}; listenerCount: {}; prependListener: {}; prependOnceListener: {}; eventNames: {}; } \| { toJSON: {}; } \| { attachment: string \| PreparedTranslation \| { [x: number]: number; write: {}; toString: {}; toJSON: {}; equals: {}; compare: {}; copy: {}; slice: {}; subarray: {}; writeBigInt64BE: {}; ... 99 more ...; readonly [Symbol.toStringTag]: string \| PreparedTranslation; } \| { ...; }; ... 7 more ...; toJSON: {}; } \| { attachment: string \| PreparedTranslation \| { [x: number]: number; write: {}; toString: {}; toJSON: {}; equals: {}; compare: {}; copy: {}; slice: {}; subarray: {}; writeBigInt64BE: {}; ... 99 more ...; readonly [Symbol.toStringTag]: string \| PreparedTranslation; } \| { ...; }; name?: string \| ... 1 more ... \| undefi...)[] ; `flags?`: `string` \| [`PreparedTranslation`](PreparedTranslation.md) \| `SuppressEmbeds` \| `Ephemeral` \| { readonly bitfield: MessageFlags.SuppressEmbeds \| MessageFlags.Ephemeral; readonly add: {}; readonly any: {}; readonly equals: {}; readonly freeze: {}; readonly has: {}; readonly missing: {}; ... 5 more ...; readonly [Symbol.iterator]: {}; } \| readonly (`string` \| [`PreparedTranslation`](PreparedTranslation.md) \| `SuppressEmbeds` \| `Ephemeral` \| `RecursiveReadonlyArray`<`SuppressEmbeds` \| `Ephemeral` \| ``"SuppressEmbeds"`` \| ``"Ephemeral"`` \| \`${bigint}\` \| `Readonly`<`BitField`<``"SuppressEmbeds"`` \| ``"Ephemeral"``, `SuppressEmbeds` \| `Ephemeral`\>\>\> \| { readonly bitfield: MessageFlags.SuppressEmbeds \| MessageFlags.Ephemeral; readonly add: {}; readonly any: {}; readonly equals: {}; readonly freeze: {}; readonly has: {}; readonly missing: {}; ... 5 more ...; readonly [Symbol.iterator]: {}; })[] ; `tts?`: `boolean`  } \| { `allowedMentions?`: { parse?: (string \| PreparedTranslation)[] \| undefined; roles?: (string \| PreparedTranslation)[] \| undefined; users?: (string \| PreparedTranslation)[] \| undefined; repliedUser?: boolean \| undefined; } ; `components?`: ({ components: ({ custom\_id: string \| PreparedTranslation; label?: string \| PreparedTranslation \| undefined; style: ButtonStyle.Primary \| ButtonStyle.Secondary \| ButtonStyle.Success \| ButtonStyle.Danger; emoji?: { ...; } \| undefined; disabled?: boolean \| undefined; type: ComponentType.Button; } \| ... 5 more ... \| { .... \| { toJSON: {}; } \| { components: ({ toJSON: {}; } \| { style: ButtonStyle.Primary \| ButtonStyle.Secondary \| ButtonStyle.Success \| ButtonStyle.Danger; customId: string \| PreparedTranslation; type: ComponentType.Button; disabled?: boolean \| undefined; emoji?: string \| ... 2 more ... \| undefined; label?: string \| ... 1 more ... \| undefine...)[] ; `content?`: `string` \| [`PreparedTranslation`](PreparedTranslation.md) ; `embeds?`: ({ title?: string \| PreparedTranslation \| undefined; type?: string \| PreparedTranslation \| undefined; description?: string \| PreparedTranslation \| undefined; ... 9 more ...; fields?: { ...; }[] \| undefined; } \| { toJSON: {}; })[] ; `failIfNotExists?`: `boolean` ; `files?`: (`string` \| [`PreparedTranslation`](PreparedTranslation.md) \| { contentType: string \| PreparedTranslation \| null; description: string \| PreparedTranslation \| null; duration: number \| null; ephemeral: boolean; ... 10 more ...; toJSON: {}; } \| { [x: number]: number; write: {}; toString: {}; toJSON: {}; equals: {}; compare: {}; copy: {}; slice: {}; subarray: {}; writeBigInt64BE: {}; writeBigInt64LE: {}; writeBigUInt64BE: {}; writeBigUint64BE: {}; ... 96 more ...; readonly [Symbol.toStringTag]: string \| PreparedTranslation; } \| { pipe: {}; compose: {}; addListener: {}; on: {}; once: {}; removeListener: {}; off: {}; removeAllListeners: {}; setMaxListeners: {}; getMaxListeners: {}; listeners: {}; rawListeners: {}; emit: {}; listenerCount: {}; prependListener: {}; prependOnceListener: {}; eventNames: {}; } \| { toJSON: {}; } \| { attachment: string \| PreparedTranslation \| { [x: number]: number; write: {}; toString: {}; toJSON: {}; equals: {}; compare: {}; copy: {}; slice: {}; subarray: {}; writeBigInt64BE: {}; ... 99 more ...; readonly [Symbol.toStringTag]: string \| PreparedTranslation; } \| { ...; }; ... 7 more ...; toJSON: {}; } \| { attachment: string \| PreparedTranslation \| { [x: number]: number; write: {}; toString: {}; toJSON: {}; equals: {}; compare: {}; copy: {}; slice: {}; subarray: {}; writeBigInt64BE: {}; ... 99 more ...; readonly [Symbol.toStringTag]: string \| PreparedTranslation; } \| { ...; }; name?: string \| ... 1 more ... \| undefi...)[] ; `flags?`: `string` \| [`PreparedTranslation`](PreparedTranslation.md) \| `SuppressEmbeds` \| `SuppressNotifications` \| readonly (`string` \| [`PreparedTranslation`](PreparedTranslation.md) \| `SuppressEmbeds` \| `SuppressNotifications` \| `RecursiveReadonlyArray`<`SuppressEmbeds` \| `SuppressNotifications` \| ``"SuppressEmbeds"`` \| ``"SuppressNotifications"`` \| \`${bigint}\` \| `Readonly`<`BitField`<``"SuppressEmbeds"`` \| ``"SuppressNotifications"``, `SuppressEmbeds` \| `SuppressNotifications`\>\>\> \| { readonly bitfield: MessageFlags.SuppressEmbeds \| MessageFlags.SuppressNotifications; readonly add: {}; readonly any: {}; readonly equals: {}; readonly freeze: {}; readonly has: {}; readonly missing: {}; ... 5 more ...; readonly [Symbol.iterator]: {}; })[] \| { readonly bitfield: MessageFlags.SuppressEmbeds \| MessageFlags.SuppressNotifications; readonly add: {}; readonly any: {}; readonly equals: {}; readonly freeze: {}; readonly has: {}; readonly missing: {}; ... 5 more ...; readonly [Symbol.iterator]: {}; } ; `nonce?`: `string` \| `number` \| [`PreparedTranslation`](PreparedTranslation.md) ; `stickers?`: (`string` \| [`PreparedTranslation`](PreparedTranslation.md) \| { readonly createdTimestamp: number; readonly createdAt: { toString: {}; toDateString: {}; toTimeString: {}; toLocaleString: {}; toLocaleDateString: {}; toLocaleTimeString: {}; valueOf: {}; getTime: {}; ... 35 more ...; [Symbol.toPrimitive]: {}; }; ... 22 more ...; valueOf: {}; })[] ; `tts?`: `boolean`  } |

#### Returns

`Promise`<`Response`\>

#### Defined in

[src/handlers/CommandRequest.ts:20](https://github.com/s809/noisecord/blob/master/src/handlers/CommandRequest.ts#L20)
