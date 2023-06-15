[@s809/noisecord](../README.md) / [Exports](../modules.md) / CommandResponse

# Class: CommandResponse

Abstract instance of response-to-command related data.

## Hierarchy

- **`CommandResponse`**

  ↳ [`InteractionCommandResponse`](InteractionCommandResponse.md)

  ↳ [`MessageCommandResponse`](MessageCommandResponse.md)

## Table of contents

### Constructors

- [constructor](CommandResponse.md#constructor)

### Accessors

- [content](CommandResponse.md#content)
- [embeds](CommandResponse.md#embeds)
- [flags](CommandResponse.md#flags)

### Methods

- [createMessageComponentCollector](CommandResponse.md#createmessagecomponentcollector)
- [delete](CommandResponse.md#delete)
- [replyOrEdit](CommandResponse.md#replyoredit)

## Constructors

### constructor

**new CommandResponse**()

## Accessors

### content

`get` **content**(): ``null`` \| `string`

Get content of the message, if present.

#### Returns

``null`` \| `string`

#### Defined in

[src/handlers/CommandResponse.ts:22](https://github.com/s809/noisecord/blob/5de1f63/src/handlers/CommandResponse.ts#L22)

___

### embeds

`get` **embeds**(): ``null`` \| `Embed`[]

Get all embeds of the message, or empty array if there are none.

#### Returns

``null`` \| `Embed`[]

#### Defined in

[src/handlers/CommandResponse.ts:27](https://github.com/s809/noisecord/blob/5de1f63/src/handlers/CommandResponse.ts#L27)

___

### flags

`get` **flags**(): ``null`` \| `Readonly`<`MessageFlagsBitField`\>

Get flags of the message, if present.

#### Returns

``null`` \| `Readonly`<`MessageFlagsBitField`\>

#### Defined in

[src/handlers/CommandResponse.ts:32](https://github.com/s809/noisecord/blob/5de1f63/src/handlers/CommandResponse.ts#L32)

## Methods

### createMessageComponentCollector

`Abstract` **createMessageComponentCollector**<`T`\>(`options?`): `InteractionCollector`<`MappedInteractionTypes`<`boolean`\>[`T`]\>

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

#### Defined in

[src/handlers/CommandResponse.ts:17](https://github.com/s809/noisecord/blob/5de1f63/src/handlers/CommandResponse.ts#L17)

___

### delete

`Abstract` **delete**(): `Promise`<`void`\>

Deletes the message, if possible.

#### Returns

`Promise`<`void`\>

#### Defined in

[src/handlers/CommandResponse.ts:14](https://github.com/s809/noisecord/blob/5de1f63/src/handlers/CommandResponse.ts#L14)

___

### replyOrEdit

`Abstract` **replyOrEdit**(`options`): `Promise`<[`CommandResponse`](CommandResponse.md)\>

Edits the message, if possible.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `string` \| `MessageCreateOptions` \| `MessageEditOptions` \| `InteractionEditReplyOptions` \| `InteractionReplyOptions` |

#### Returns

`Promise`<[`CommandResponse`](CommandResponse.md)\>

#### Defined in

[src/handlers/CommandResponse.ts:11](https://github.com/s809/noisecord/blob/5de1f63/src/handlers/CommandResponse.ts#L11)
