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

[src/handlers/CommandResponse.ts:22](https://github.com/s809/noisecord/blob/5e7fdcd/src/handlers/CommandResponse.ts#L22)

___

### embeds

`get` **embeds**(): ``null`` \| `Embed`[]

Get all embeds of the message, or empty array if there are none.

#### Returns

``null`` \| `Embed`[]

#### Inherited from

CommandResponse.embeds

#### Defined in

[src/handlers/CommandResponse.ts:27](https://github.com/s809/noisecord/blob/5e7fdcd/src/handlers/CommandResponse.ts#L27)

___

### flags

`get` **flags**(): ``null`` \| `Readonly`<`MessageFlagsBitField`\>

Get flags of the message, if present.

#### Returns

``null`` \| `Readonly`<`MessageFlagsBitField`\>

#### Inherited from

CommandResponse.flags

#### Defined in

[src/handlers/CommandResponse.ts:32](https://github.com/s809/noisecord/blob/5e7fdcd/src/handlers/CommandResponse.ts#L32)

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

[src/handlers/Message/MessageCommandResponse.ts:32](https://github.com/s809/noisecord/blob/5e7fdcd/src/handlers/Message/MessageCommandResponse.ts#L32)

___

### delete

**delete**(): `Promise`<`void`\>

Deletes the message, if possible.

#### Returns

`Promise`<`void`\>

#### Overrides

[CommandResponse](CommandResponse.md).[delete](CommandResponse.md#delete)

#### Defined in

[src/handlers/Message/MessageCommandResponse.ts:27](https://github.com/s809/noisecord/blob/5e7fdcd/src/handlers/Message/MessageCommandResponse.ts#L27)

___

### replyOrEdit

**replyOrEdit**(`options`): `Promise`<[`MessageCommandResponse`](MessageCommandResponse.md)\>

Edits the message, if possible.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `string` \| `MessageCreateOptions` \| `MessageEditOptions` \| `InteractionEditReplyOptions` \| `InteractionReplyOptions` |

#### Returns

`Promise`<[`MessageCommandResponse`](MessageCommandResponse.md)\>

#### Overrides

[CommandResponse](CommandResponse.md).[replyOrEdit](CommandResponse.md#replyoredit)

#### Defined in

[src/handlers/Message/MessageCommandResponse.ts:14](https://github.com/s809/noisecord/blob/5e7fdcd/src/handlers/Message/MessageCommandResponse.ts#L14)
