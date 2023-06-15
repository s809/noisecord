[@s809/noisecord](../README.md) / [Exports](../modules.md) / ContextMenuCommandDefinition

# Interface: ContextMenuCommandDefinition<InteractionType, AllowDMs\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `InteractionType` | extends [`InteractionTypes`](../modules/ContextMenuCommandDefinition.md#interactiontypes) = [`InteractionTypes`](../modules/ContextMenuCommandDefinition.md#interactiontypes) |
| `AllowDMs` | extends `boolean` = `boolean` |

## Table of contents

### Properties

- [allowDMs](ContextMenuCommandDefinition-1.md#allowdms)
- [handler](ContextMenuCommandDefinition-1.md#handler)
- [key](ContextMenuCommandDefinition-1.md#key)
- [type](ContextMenuCommandDefinition-1.md#type)

## Properties

### allowDMs

 `Optional` **allowDMs**: `AllowDMs`

#### Defined in

[src/interfaces/ContextMenuCommand.ts:9](https://github.com/s809/noisecord/blob/5de1f63/src/interfaces/ContextMenuCommand.ts#L9)

___

### handler

 **handler**: (`interaction`: [`InteractionCommandRequest`](../classes/InteractionCommandRequest.md)<[`ContextMenuCommand`](ContextMenuCommand.md), [`CommandTypeToInteraction`](ContextMenuCommandDefinition.CommandTypeToInteraction.md)<[`InGuildCacheType`](../modules.md#inguildcachetype)<`AllowDMs` extends ``true`` ? ``false`` : ``true``\>\>[`InteractionType`]\>) => `void`

#### Type declaration

(`interaction`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `interaction` | [`InteractionCommandRequest`](../classes/InteractionCommandRequest.md)<[`ContextMenuCommand`](ContextMenuCommand.md), [`CommandTypeToInteraction`](ContextMenuCommandDefinition.CommandTypeToInteraction.md)<[`InGuildCacheType`](../modules.md#inguildcachetype)<`AllowDMs` extends ``true`` ? ``false`` : ``true``\>\>[`InteractionType`]\> |

##### Returns

`void`

#### Defined in

[src/interfaces/ContextMenuCommand.ts:10](https://github.com/s809/noisecord/blob/5de1f63/src/interfaces/ContextMenuCommand.ts#L10)

___

### key

 **key**: `string`

#### Defined in

[src/interfaces/ContextMenuCommand.ts:7](https://github.com/s809/noisecord/blob/5de1f63/src/interfaces/ContextMenuCommand.ts#L7)

___

### type

 **type**: `InteractionType`

#### Defined in

[src/interfaces/ContextMenuCommand.ts:8](https://github.com/s809/noisecord/blob/5de1f63/src/interfaces/ContextMenuCommand.ts#L8)
