[@s809/noisecord](../README.md) / [Exports](../modules.md) / MessageCommandResponse

# Class: MessageCommandResponse

## Hierarchy

- [`CommandResponse`](CommandResponse.md)

  ↳ **`MessageCommandResponse`**

## Table of contents

### Accessors

- [content](MessageCommandResponse.md#content)
- [embeds](MessageCommandResponse.md#embeds)
- [flags](MessageCommandResponse.md#flags)

### Methods

- [createMessageComponentCollector](MessageCommandResponse.md#createmessagecomponentcollector)
- [delete](MessageCommandResponse.md#delete)
- [replyOrEdit](MessageCommandResponse.md#replyoredit)

## Accessors

### content

`get` **content**(): ``null`` \| `string`

Get content of the message, if present.

#### Returns

``null`` \| `string`

#### Inherited from

CommandResponse.content

#### Defined in

[src/handlers/CommandResponse.ts:23](https://github.com/s809/noisecord/blob/master/src/handlers/CommandResponse.ts#L23)

___

### embeds

`get` **embeds**(): ``null`` \| `Embed`[]

Get all embeds of the message, or empty array if there are none.

#### Returns

``null`` \| `Embed`[]

#### Inherited from

CommandResponse.embeds

#### Defined in

[src/handlers/CommandResponse.ts:28](https://github.com/s809/noisecord/blob/master/src/handlers/CommandResponse.ts#L28)

___

### flags

`get` **flags**(): ``null`` \| `Readonly`<`MessageFlagsBitField`\>

Get flags of the message, if present.

#### Returns

``null`` \| `Readonly`<`MessageFlagsBitField`\>

#### Inherited from

CommandResponse.flags

#### Defined in

[src/handlers/CommandResponse.ts:33](https://github.com/s809/noisecord/blob/master/src/handlers/CommandResponse.ts#L33)

## Methods

### createMessageComponentCollector

**createMessageComponentCollector**<`T`\>(`options?`): `InteractionCollector`<`MappedInteractionTypes`<`boolean`\>[`T`]\>

Creates collector of message components.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `MessageComponentType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `MessageCollectorOptionsParams`<`T`\> |

#### Returns

`InteractionCollector`<`MappedInteractionTypes`<`boolean`\>[`T`]\>

#### Overrides

[CommandResponse](CommandResponse.md).[createMessageComponentCollector](CommandResponse.md#createmessagecomponentcollector)

#### Defined in

[src/handlers/Message/MessageCommandResponse.ts:35](https://github.com/s809/noisecord/blob/master/src/handlers/Message/MessageCommandResponse.ts#L35)

___

### delete

**delete**(): `Promise`<`void`\>

Deletes the message, if possible.

#### Returns

`Promise`<`void`\>

#### Overrides

[CommandResponse](CommandResponse.md).[delete](CommandResponse.md#delete)

#### Defined in

[src/handlers/Message/MessageCommandResponse.ts:30](https://github.com/s809/noisecord/blob/master/src/handlers/Message/MessageCommandResponse.ts#L30)

___

### replyOrEdit

**replyOrEdit**(`options`): `Promise`<[`MessageCommandResponse`](MessageCommandResponse.md)\>

Edits the message, if possible.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `string` \| [`PreparedTranslation`](PreparedTranslation.md) \| { `allowedMentions?`: { parse?: (string \| PreparedTranslation)[] \| undefined; roles?: (string \| PreparedTranslation)[] \| undefined; users?: (string \| PreparedTranslation)[] \| undefined; repliedUser?: boolean \| undefined; } ; `components?`: ({ components: ({ custom\_id: string \| PreparedTranslation; label?: string \| PreparedTranslation \| undefined; style: ButtonStyle.Primary \| ButtonStyle.Secondary \| ButtonStyle.Success \| ButtonStyle.Danger; emoji?: { ...; } \| undefined; disabled?: boolean \| undefined; type: ComponentType.Button; } \| ... 5 more ... \| { .... \| { toJSON: {}; } \| { components: ({ toJSON: {}; } \| { style: ButtonStyle.Primary \| ButtonStyle.Secondary \| ButtonStyle.Success \| ButtonStyle.Danger; customId: string \| PreparedTranslation; type: ComponentType.Button; disabled?: boolean \| undefined; emoji?: string \| ... 2 more ... \| undefined; label?: string \| ... 1 more ... \| undefine...)[] ; `content?`: `string` \| [`PreparedTranslation`](PreparedTranslation.md) ; `embeds?`: ({ title?: string \| PreparedTranslation \| undefined; type?: string \| PreparedTranslation \| undefined; description?: string \| PreparedTranslation \| undefined; ... 9 more ...; fields?: { ...; }[] \| undefined; } \| { toJSON: {}; })[] ; `files?`: (`string` \| [`PreparedTranslation`](PreparedTranslation.md) \| { contentType: string \| PreparedTranslation \| null; description: string \| PreparedTranslation \| null; duration: number \| null; ephemeral: boolean; ... 10 more ...; toJSON: {}; } \| { [x: number]: number; write: {}; toString: {}; toJSON: {}; equals: {}; compare: {}; copy: {}; slice: {}; subarray: {}; writeBigInt64BE: {}; writeBigInt64LE: {}; writeBigUInt64BE: {}; writeBigUint64BE: {}; ... 96 more ...; readonly [Symbol.toStringTag]: string \| PreparedTranslation; } \| { pipe: {}; compose: {}; addListener: {}; on: {}; once: {}; removeListener: {}; off: {}; removeAllListeners: {}; setMaxListeners: {}; getMaxListeners: {}; listeners: {}; rawListeners: {}; emit: {}; listenerCount: {}; prependListener: {}; prependOnceListener: {}; eventNames: {}; } \| { toJSON: {}; } \| { attachment: string \| PreparedTranslation \| { [x: number]: number; write: {}; toString: {}; toJSON: {}; equals: {}; compare: {}; copy: {}; slice: {}; subarray: {}; writeBigInt64BE: {}; ... 99 more ...; readonly [Symbol.toStringTag]: string \| PreparedTranslation; } \| { ...; }; ... 7 more ...; toJSON: {}; } \| { attachment: string \| PreparedTranslation \| { [x: number]: number; write: {}; toString: {}; toJSON: {}; equals: {}; compare: {}; copy: {}; slice: {}; subarray: {}; writeBigInt64BE: {}; ... 99 more ...; readonly [Symbol.toStringTag]: string \| PreparedTranslation; } \| { ...; }; name?: string \| ... 1 more ... \| undefi...)[] ; `flags?`: `string` \| [`PreparedTranslation`](PreparedTranslation.md) \| `SuppressEmbeds` \| `SuppressNotifications` \| { readonly bitfield: MessageFlags.SuppressEmbeds \| MessageFlags.SuppressNotifications; readonly add: {}; readonly any: {}; readonly equals: {}; readonly freeze: {}; readonly has: {}; readonly missing: {}; ... 5 more ...; readonly [Symbol.iterator]: {}; } \| readonly (`string` \| [`PreparedTranslation`](PreparedTranslation.md) \| `SuppressEmbeds` \| `SuppressNotifications` \| `RecursiveReadonlyArray`<`SuppressEmbeds` \| `SuppressNotifications` \| ``"SuppressEmbeds"`` \| ``"SuppressNotifications"`` \| \`${bigint}\` \| `Readonly`<`BitField`<``"SuppressEmbeds"`` \| ``"SuppressNotifications"``, `SuppressEmbeds` \| `SuppressNotifications`\>\>\> \| { readonly bitfield: MessageFlags.SuppressEmbeds \| MessageFlags.SuppressNotifications; readonly add: {}; readonly any: {}; readonly equals: {}; readonly freeze: {}; readonly has: {}; readonly missing: {}; ... 5 more ...; readonly [Symbol.iterator]: {}; })[] ; `nonce?`: `string` \| `number` \| [`PreparedTranslation`](PreparedTranslation.md) ; `reply?`: { messageReference: string \| PreparedTranslation \| { activity: { partyId?: string \| PreparedTranslation \| undefined; type: MessageActivityType; } \| null; ... 64 more ...; valueOf: {}; }; failIfNotExists?: boolean \| undefined; } ; `stickers?`: (`string` \| [`PreparedTranslation`](PreparedTranslation.md) \| { readonly createdTimestamp: number; readonly createdAt: { toString: {}; toDateString: {}; toTimeString: {}; toLocaleString: {}; toLocaleDateString: {}; toLocaleTimeString: {}; valueOf: {}; getTime: {}; ... 35 more ...; [Symbol.toPrimitive]: {}; }; ... 22 more ...; valueOf: {}; })[] ; `tts?`: `boolean`  } \| { `allowedMentions?`: { parse?: (string \| PreparedTranslation)[] \| undefined; roles?: (string \| PreparedTranslation)[] \| undefined; users?: (string \| PreparedTranslation)[] \| undefined; repliedUser?: boolean \| undefined; } ; `attachments?`: { toJSON: {}; }[] ; `components?`: ({ components: ({ custom\_id: string \| PreparedTranslation; label?: string \| PreparedTranslation \| undefined; style: ButtonStyle.Primary \| ButtonStyle.Secondary \| ButtonStyle.Success \| ButtonStyle.Danger; emoji?: { ...; } \| undefined; disabled?: boolean \| undefined; type: ComponentType.Button; } \| ... 5 more ... \| { .... \| { toJSON: {}; } \| { components: ({ toJSON: {}; } \| { style: ButtonStyle.Primary \| ButtonStyle.Secondary \| ButtonStyle.Success \| ButtonStyle.Danger; customId: string \| PreparedTranslation; type: ComponentType.Button; disabled?: boolean \| undefined; emoji?: string \| ... 2 more ... \| undefined; label?: string \| ... 1 more ... \| undefine...)[] ; `content?`: ``null`` \| `string` \| [`PreparedTranslation`](PreparedTranslation.md) ; `embeds?`: ({ title?: string \| PreparedTranslation \| undefined; type?: string \| PreparedTranslation \| undefined; description?: string \| PreparedTranslation \| undefined; ... 9 more ...; fields?: { ...; }[] \| undefined; } \| { toJSON: {}; })[] ; `files?`: (`string` \| [`PreparedTranslation`](PreparedTranslation.md) \| { contentType: string \| PreparedTranslation \| null; description: string \| PreparedTranslation \| null; duration: number \| null; ephemeral: boolean; ... 10 more ...; toJSON: {}; } \| { [x: number]: number; write: {}; toString: {}; toJSON: {}; equals: {}; compare: {}; copy: {}; slice: {}; subarray: {}; writeBigInt64BE: {}; writeBigInt64LE: {}; writeBigUInt64BE: {}; writeBigUint64BE: {}; ... 96 more ...; readonly [Symbol.toStringTag]: string \| PreparedTranslation; } \| { pipe: {}; compose: {}; addListener: {}; on: {}; once: {}; removeListener: {}; off: {}; removeAllListeners: {}; setMaxListeners: {}; getMaxListeners: {}; listeners: {}; rawListeners: {}; emit: {}; listenerCount: {}; prependListener: {}; prependOnceListener: {}; eventNames: {}; } \| { toJSON: {}; } \| { attachment: string \| PreparedTranslation \| { [x: number]: number; write: {}; toString: {}; toJSON: {}; equals: {}; compare: {}; copy: {}; slice: {}; subarray: {}; writeBigInt64BE: {}; ... 99 more ...; readonly [Symbol.toStringTag]: string \| PreparedTranslation; } \| { ...; }; ... 7 more ...; toJSON: {}; } \| { attachment: string \| PreparedTranslation \| { [x: number]: number; write: {}; toString: {}; toJSON: {}; equals: {}; compare: {}; copy: {}; slice: {}; subarray: {}; writeBigInt64BE: {}; ... 99 more ...; readonly [Symbol.toStringTag]: string \| PreparedTranslation; } \| { ...; }; name?: string \| ... 1 more ... \| undefi...)[] ; `flags?`: `string` \| [`PreparedTranslation`](PreparedTranslation.md) \| `SuppressEmbeds` \| { readonly bitfield: MessageFlags.SuppressEmbeds; readonly add: {}; readonly any: {}; readonly equals: {}; readonly freeze: {}; readonly has: {}; readonly missing: {}; readonly remove: {}; ... 4 more ...; readonly [Symbol.iterator]: {}; } \| readonly (`string` \| [`PreparedTranslation`](PreparedTranslation.md) \| `SuppressEmbeds` \| `RecursiveReadonlyArray`<`SuppressEmbeds` \| ``"SuppressEmbeds"`` \| \`${bigint}\` \| `Readonly`<`BitField`<``"SuppressEmbeds"``, `SuppressEmbeds`\>\>\> \| { readonly bitfield: MessageFlags.SuppressEmbeds; readonly add: {}; readonly any: {}; readonly equals: {}; readonly freeze: {}; readonly has: {}; readonly missing: {}; readonly remove: {}; ... 4 more ...; readonly [Symbol.iterator]: {}; })[]  } \| { `allowedMentions?`: { parse?: (string \| PreparedTranslation)[] \| undefined; roles?: (string \| PreparedTranslation)[] \| undefined; users?: (string \| PreparedTranslation)[] \| undefined; repliedUser?: boolean \| undefined; } ; `attachments?`: { toJSON: {}; }[] ; `components?`: ({ components: ({ custom\_id: string \| PreparedTranslation; label?: string \| PreparedTranslation \| undefined; style: ButtonStyle.Primary \| ButtonStyle.Secondary \| ButtonStyle.Success \| ButtonStyle.Danger; emoji?: { ...; } \| undefined; disabled?: boolean \| undefined; type: ComponentType.Button; } \| ... 5 more ... \| { .... \| { toJSON: {}; } \| { components: ({ toJSON: {}; } \| { style: ButtonStyle.Primary \| ButtonStyle.Secondary \| ButtonStyle.Success \| ButtonStyle.Danger; customId: string \| PreparedTranslation; type: ComponentType.Button; disabled?: boolean \| undefined; emoji?: string \| ... 2 more ... \| undefined; label?: string \| ... 1 more ... \| undefine...)[] ; `content?`: ``null`` \| `string` \| [`PreparedTranslation`](PreparedTranslation.md) ; `embeds?`: ({ title?: string \| PreparedTranslation \| undefined; type?: string \| PreparedTranslation \| undefined; description?: string \| PreparedTranslation \| undefined; ... 9 more ...; fields?: { ...; }[] \| undefined; } \| { toJSON: {}; })[] ; `files?`: (`string` \| [`PreparedTranslation`](PreparedTranslation.md) \| { contentType: string \| PreparedTranslation \| null; description: string \| PreparedTranslation \| null; duration: number \| null; ephemeral: boolean; ... 10 more ...; toJSON: {}; } \| { [x: number]: number; write: {}; toString: {}; toJSON: {}; equals: {}; compare: {}; copy: {}; slice: {}; subarray: {}; writeBigInt64BE: {}; writeBigInt64LE: {}; writeBigUInt64BE: {}; writeBigUint64BE: {}; ... 96 more ...; readonly [Symbol.toStringTag]: string \| PreparedTranslation; } \| { pipe: {}; compose: {}; addListener: {}; on: {}; once: {}; removeListener: {}; off: {}; removeAllListeners: {}; setMaxListeners: {}; getMaxListeners: {}; listeners: {}; rawListeners: {}; emit: {}; listenerCount: {}; prependListener: {}; prependOnceListener: {}; eventNames: {}; } \| { toJSON: {}; } \| { attachment: string \| PreparedTranslation \| { [x: number]: number; write: {}; toString: {}; toJSON: {}; equals: {}; compare: {}; copy: {}; slice: {}; subarray: {}; writeBigInt64BE: {}; ... 99 more ...; readonly [Symbol.toStringTag]: string \| PreparedTranslation; } \| { ...; }; ... 7 more ...; toJSON: {}; } \| { attachment: string \| PreparedTranslation \| { [x: number]: number; write: {}; toString: {}; toJSON: {}; equals: {}; compare: {}; copy: {}; slice: {}; subarray: {}; writeBigInt64BE: {}; ... 99 more ...; readonly [Symbol.toStringTag]: string \| PreparedTranslation; } \| { ...; }; name?: string \| ... 1 more ... \| undefi...)[] ; `message?`: `string` \| [`PreparedTranslation`](PreparedTranslation.md) \| { activity: { partyId?: string \| PreparedTranslation \| undefined; type: MessageActivityType; } \| null; applicationId: string \| PreparedTranslation \| null; ... 63 more ...; valueOf: {}; } ; `threadId?`: `string` \| [`PreparedTranslation`](PreparedTranslation.md)  } \| { `allowedMentions?`: { parse?: (string \| PreparedTranslation)[] \| undefined; roles?: (string \| PreparedTranslation)[] \| undefined; users?: (string \| PreparedTranslation)[] \| undefined; repliedUser?: boolean \| undefined; } ; `components?`: ({ components: ({ custom\_id: string \| PreparedTranslation; label?: string \| PreparedTranslation \| undefined; style: ButtonStyle.Primary \| ButtonStyle.Secondary \| ButtonStyle.Success \| ButtonStyle.Danger; emoji?: { ...; } \| undefined; disabled?: boolean \| undefined; type: ComponentType.Button; } \| ... 5 more ... \| { .... \| { toJSON: {}; } \| { components: ({ toJSON: {}; } \| { style: ButtonStyle.Primary \| ButtonStyle.Secondary \| ButtonStyle.Success \| ButtonStyle.Danger; customId: string \| PreparedTranslation; type: ComponentType.Button; disabled?: boolean \| undefined; emoji?: string \| ... 2 more ... \| undefined; label?: string \| ... 1 more ... \| undefine...)[] ; `content?`: `string` \| [`PreparedTranslation`](PreparedTranslation.md) ; `embeds?`: ({ title?: string \| PreparedTranslation \| undefined; type?: string \| PreparedTranslation \| undefined; description?: string \| PreparedTranslation \| undefined; ... 9 more ...; fields?: { ...; }[] \| undefined; } \| { toJSON: {}; })[] ; `ephemeral?`: `boolean` ; `fetchReply?`: `boolean` ; `files?`: (`string` \| [`PreparedTranslation`](PreparedTranslation.md) \| { contentType: string \| PreparedTranslation \| null; description: string \| PreparedTranslation \| null; duration: number \| null; ephemeral: boolean; ... 10 more ...; toJSON: {}; } \| { [x: number]: number; write: {}; toString: {}; toJSON: {}; equals: {}; compare: {}; copy: {}; slice: {}; subarray: {}; writeBigInt64BE: {}; writeBigInt64LE: {}; writeBigUInt64BE: {}; writeBigUint64BE: {}; ... 96 more ...; readonly [Symbol.toStringTag]: string \| PreparedTranslation; } \| { pipe: {}; compose: {}; addListener: {}; on: {}; once: {}; removeListener: {}; off: {}; removeAllListeners: {}; setMaxListeners: {}; getMaxListeners: {}; listeners: {}; rawListeners: {}; emit: {}; listenerCount: {}; prependListener: {}; prependOnceListener: {}; eventNames: {}; } \| { toJSON: {}; } \| { attachment: string \| PreparedTranslation \| { [x: number]: number; write: {}; toString: {}; toJSON: {}; equals: {}; compare: {}; copy: {}; slice: {}; subarray: {}; writeBigInt64BE: {}; ... 99 more ...; readonly [Symbol.toStringTag]: string \| PreparedTranslation; } \| { ...; }; ... 7 more ...; toJSON: {}; } \| { attachment: string \| PreparedTranslation \| { [x: number]: number; write: {}; toString: {}; toJSON: {}; equals: {}; compare: {}; copy: {}; slice: {}; subarray: {}; writeBigInt64BE: {}; ... 99 more ...; readonly [Symbol.toStringTag]: string \| PreparedTranslation; } \| { ...; }; name?: string \| ... 1 more ... \| undefi...)[] ; `flags?`: `string` \| [`PreparedTranslation`](PreparedTranslation.md) \| `SuppressEmbeds` \| `Ephemeral` \| { readonly bitfield: MessageFlags.SuppressEmbeds \| MessageFlags.Ephemeral; readonly add: {}; readonly any: {}; readonly equals: {}; readonly freeze: {}; readonly has: {}; readonly missing: {}; ... 5 more ...; readonly [Symbol.iterator]: {}; } \| readonly (`string` \| [`PreparedTranslation`](PreparedTranslation.md) \| `SuppressEmbeds` \| `Ephemeral` \| `RecursiveReadonlyArray`<`SuppressEmbeds` \| `Ephemeral` \| ``"SuppressEmbeds"`` \| ``"Ephemeral"`` \| \`${bigint}\` \| `Readonly`<`BitField`<``"SuppressEmbeds"`` \| ``"Ephemeral"``, `SuppressEmbeds` \| `Ephemeral`\>\>\> \| { readonly bitfield: MessageFlags.SuppressEmbeds \| MessageFlags.Ephemeral; readonly add: {}; readonly any: {}; readonly equals: {}; readonly freeze: {}; readonly has: {}; readonly missing: {}; ... 5 more ...; readonly [Symbol.iterator]: {}; })[] ; `tts?`: `boolean`  } |

#### Returns

`Promise`<[`MessageCommandResponse`](MessageCommandResponse.md)\>

#### Overrides

[CommandResponse](CommandResponse.md).[replyOrEdit](CommandResponse.md#replyoredit)

#### Defined in

[src/handlers/Message/MessageCommandResponse.ts:15](https://github.com/s809/noisecord/blob/master/src/handlers/Message/MessageCommandResponse.ts#L15)
