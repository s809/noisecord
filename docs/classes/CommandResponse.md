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

[src/handlers/CommandResponse.ts:38](https://github.com/s809/noisecord/blob/master/src/handlers/CommandResponse.ts#L38)

___

### embeds

`get` **embeds**(): ``null`` \| `Embed`[]

Get all embeds of the message, or empty array if there are none.

#### Returns

``null`` \| `Embed`[]

#### Defined in

[src/handlers/CommandResponse.ts:43](https://github.com/s809/noisecord/blob/master/src/handlers/CommandResponse.ts#L43)

___

### flags

`get` **flags**(): ``null`` \| `Readonly`<`MessageFlagsBitField`\>

Get flags of the message, if present.

#### Returns

``null`` \| `Readonly`<`MessageFlagsBitField`\>

#### Defined in

[src/handlers/CommandResponse.ts:48](https://github.com/s809/noisecord/blob/master/src/handlers/CommandResponse.ts#L48)

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

[src/handlers/CommandResponse.ts:33](https://github.com/s809/noisecord/blob/master/src/handlers/CommandResponse.ts#L33)

___

### delete

`Abstract` **delete**(): `Promise`<`void`\>

Deletes the message, if possible.

#### Returns

`Promise`<`void`\>

#### Defined in

[src/handlers/CommandResponse.ts:30](https://github.com/s809/noisecord/blob/master/src/handlers/CommandResponse.ts#L30)

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

[src/handlers/CommandResponse.ts:13](https://github.com/s809/noisecord/blob/master/src/handlers/CommandResponse.ts#L13)
