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

[src/handlers/Interaction/InteractionCommandResponse.ts:19](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandResponse.ts#L19)

## Accessors

### content

`get` **content**(): ``null`` \| `string`

Get content of the message, if present.

#### Returns

``null`` \| `string`

#### Inherited from

CommandResponse.content

#### Defined in

[src/handlers/CommandResponse.ts:38](https://github.com/s809/noisecord/blob/master/src/handlers/CommandResponse.ts#L38)

___

### deferredOrReplied

`get` **deferredOrReplied**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/handlers/Interaction/InteractionCommandResponse.ts:9](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandResponse.ts#L9)

___

### embeds

`get` **embeds**(): ``null`` \| `Embed`[]

Get all embeds of the message, or empty array if there are none.

#### Returns

``null`` \| `Embed`[]

#### Inherited from

CommandResponse.embeds

#### Defined in

[src/handlers/CommandResponse.ts:43](https://github.com/s809/noisecord/blob/master/src/handlers/CommandResponse.ts#L43)

___

### flags

`get` **flags**(): ``null`` \| `Readonly`<`MessageFlagsBitField`\>

Get flags of the message, if present.

#### Returns

``null`` \| `Readonly`<`MessageFlagsBitField`\>

#### Inherited from

CommandResponse.flags

#### Defined in

[src/handlers/CommandResponse.ts:48](https://github.com/s809/noisecord/blob/master/src/handlers/CommandResponse.ts#L48)

___

### repliedFully

`get` **repliedFully**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/handlers/Interaction/InteractionCommandResponse.ts:14](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandResponse.ts#L14)

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

[src/handlers/Interaction/InteractionCommandResponse.ts:98](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandResponse.ts#L98)

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

[src/handlers/Interaction/InteractionCommandResponse.ts:23](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandResponse.ts#L23)

___

### delete

**delete**(): `Promise`<`void`\>

Deletes the message, if possible.

#### Returns

`Promise`<`void`\>

#### Overrides

[CommandResponse](CommandResponse.md).[delete](CommandResponse.md#delete)

#### Defined in

[src/handlers/Interaction/InteractionCommandResponse.ts:87](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandResponse.ts#L87)

___

### followUpForce

**followUpForce**(`options`): `Promise`<`Message`<`boolean`\>\>

Sends a follow up message.
If interaction is not replied to fully, throws an error.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `string` \| `InteractionReplyOptions` |

#### Returns

`Promise`<`Message`<`boolean`\>\>

#### Defined in

[src/handlers/Interaction/InteractionCommandResponse.ts:72](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandResponse.ts#L72)

___

### replyOrEdit

**replyOrEdit**(`options`): `Promise`<[`InteractionCommandResponse`](InteractionCommandResponse.md)\>

Replies to interaction or edits it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `string` \| `InteractionEditReplyOptions` \| `InteractionReplyOptions` |

#### Returns

`Promise`<[`InteractionCommandResponse`](InteractionCommandResponse.md)\>

#### Overrides

[CommandResponse](CommandResponse.md).[replyOrEdit](CommandResponse.md#replyoredit)

#### Defined in

[src/handlers/Interaction/InteractionCommandResponse.ts:36](https://github.com/s809/noisecord/blob/master/src/handlers/Interaction/InteractionCommandResponse.ts#L36)
