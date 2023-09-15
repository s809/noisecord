[@s809/noisecord](../README.md) / [Exports](../modules.md) / InteractionCommandResponse

# Class: InteractionCommandResponse

## Hierarchy

- [`CommandResponse`](CommandResponse.md)

  ↳ **`InteractionCommandResponse`**

## Table of contents

### Properties

- [interaction](InteractionCommandResponse.md#interaction)

### Accessors

- [content](InteractionCommandResponse.md#content)
- [deferredOrReplied](InteractionCommandResponse.md#deferredorreplied)
- [embeds](InteractionCommandResponse.md#embeds)
- [flags](InteractionCommandResponse.md#flags)
- [repliedFully](InteractionCommandResponse.md#repliedfully)

### Methods

- [createMessageComponentCollector](InteractionCommandResponse.md#createmessagecomponentcollector)
- [defer](InteractionCommandResponse.md#defer)
- [delete](InteractionCommandResponse.md#delete)
- [followUpForce](InteractionCommandResponse.md#followupforce)
- [replyOrEdit](InteractionCommandResponse.md#replyoredit)

## Properties

### interaction

 `Readonly` **interaction**: `CommandInteraction`<`CacheType`\>

#### Defined in

[src/handlers/Interaction/InteractionCommandResponse.ts:20](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandResponse.ts#L20)

## Accessors

### content

`get` **content**(): ``null`` \| `string`

Get content of the message, if present.

#### Returns

``null`` \| `string`

#### Inherited from

CommandResponse.content

#### Defined in

[src/handlers/CommandResponse.ts:28](https://github.com/s809/noisecord/blob/master/src/handlers/CommandResponse.ts#L28)

___

### deferredOrReplied

`get` **deferredOrReplied**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/handlers/Interaction/InteractionCommandResponse.ts:10](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandResponse.ts#L10)

___

### embeds

`get` **embeds**(): ``null`` \| `Embed`[]

Get all embeds of the message, or empty array if there are none.

#### Returns

``null`` \| `Embed`[]

#### Inherited from

CommandResponse.embeds

#### Defined in

[src/handlers/CommandResponse.ts:33](https://github.com/s809/noisecord/blob/master/src/handlers/CommandResponse.ts#L33)

___

### flags

`get` **flags**(): ``null`` \| `Readonly`<`MessageFlagsBitField`\>

Get flags of the message, if present.

#### Returns

``null`` \| `Readonly`<`MessageFlagsBitField`\>

#### Inherited from

CommandResponse.flags

#### Defined in

[src/handlers/CommandResponse.ts:38](https://github.com/s809/noisecord/blob/master/src/handlers/CommandResponse.ts#L38)

___

### repliedFully

`get` **repliedFully**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/handlers/Interaction/InteractionCommandResponse.ts:15](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandResponse.ts#L15)

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

[src/handlers/Interaction/InteractionCommandResponse.ts:99](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandResponse.ts#L99)

___

### defer

**defer**(`ephemeral?`): `Promise`<[`InteractionCommandResponse`](InteractionCommandResponse.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `ephemeral` | `boolean` | `true` |

#### Returns

`Promise`<[`InteractionCommandResponse`](InteractionCommandResponse.md)\>

#### Defined in

[src/handlers/Interaction/InteractionCommandResponse.ts:24](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandResponse.ts#L24)

___

### delete

**delete**(): `Promise`<`void`\>

Deletes the message, if possible.

#### Returns

`Promise`<`void`\>

#### Overrides

[CommandResponse](CommandResponse.md).[delete](CommandResponse.md#delete)

#### Defined in

[src/handlers/Interaction/InteractionCommandResponse.ts:88](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandResponse.ts#L88)

___

### followUpForce

**followUpForce**(`options`): `Promise`<`Message`<`boolean`\>\>

Sends a follow up message.
If interaction is not replied to fully, throws an error.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`Translatable`](../modules.md#translatable)<`string` \| `InteractionReplyOptions`\> |

#### Returns

`Promise`<`Message`<`boolean`\>\>

#### Defined in

[src/handlers/Interaction/InteractionCommandResponse.ts:73](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandResponse.ts#L73)

___

### replyOrEdit

**replyOrEdit**(`options`): `Promise`<[`InteractionCommandResponse`](InteractionCommandResponse.md)\>

Replies to interaction or edits it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`Translatable`](../modules.md#translatable)<`string` \| `InteractionEditReplyOptions` \| `InteractionReplyOptions`\> |

#### Returns

`Promise`<[`InteractionCommandResponse`](InteractionCommandResponse.md)\>

#### Overrides

[CommandResponse](CommandResponse.md).[replyOrEdit](CommandResponse.md#replyoredit)

#### Defined in

[src/handlers/Interaction/InteractionCommandResponse.ts:37](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandResponse.ts#L37)
