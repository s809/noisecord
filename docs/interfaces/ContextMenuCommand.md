[@s809/noisecord](../README.md) / [Exports](../modules.md) / ContextMenuCommand

# Interface: ContextMenuCommand

## Hierarchy

- `Required`<[`ContextMenuCommandDefinition`](ContextMenuCommandDefinition-1.md)\>

  ↳ **`ContextMenuCommand`**

## Table of contents

### Properties

- [allowDMs](ContextMenuCommand.md#allowdms)
- [appCommandData](ContextMenuCommand.md#appcommanddata)
- [appCommandId](ContextMenuCommand.md#appcommandid)
- [handler](ContextMenuCommand.md#handler)
- [key](ContextMenuCommand.md#key)
- [type](ContextMenuCommand.md#type)

## Properties

### allowDMs

 **allowDMs**: `boolean`

#### Inherited from

Required.allowDMs

#### Defined in

[src/interfaces/ContextMenuCommand.ts:9](https://github.com/s809/noisecord/blob/777b7e5/src/interfaces/ContextMenuCommand.ts#L9)

___

### appCommandData

 **appCommandData**: `UserApplicationCommandData` \| `MessageApplicationCommandData`

#### Defined in

[src/interfaces/ContextMenuCommand.ts:31](https://github.com/s809/noisecord/blob/777b7e5/src/interfaces/ContextMenuCommand.ts#L31)

___

### appCommandId

 **appCommandId**: ``null`` \| `string`

#### Defined in

[src/interfaces/ContextMenuCommand.ts:30](https://github.com/s809/noisecord/blob/777b7e5/src/interfaces/ContextMenuCommand.ts#L30)

___

### handler

 **handler**: (`interaction`: [`InteractionCommandRequest`](../classes/InteractionCommandRequest.md)<[`ContextMenuCommand`](ContextMenuCommand.md), `MessageContextMenuCommandInteraction`<`CacheType`\> \| `UserContextMenuCommandInteraction`<`CacheType`\>\>) => `void`

#### Type declaration

(`interaction`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `interaction` | [`InteractionCommandRequest`](../classes/InteractionCommandRequest.md)<[`ContextMenuCommand`](ContextMenuCommand.md), `MessageContextMenuCommandInteraction`<`CacheType`\> \| `UserContextMenuCommandInteraction`<`CacheType`\>\> |

##### Returns

`void`

#### Inherited from

Required.handler

#### Defined in

[src/interfaces/ContextMenuCommand.ts:10](https://github.com/s809/noisecord/blob/777b7e5/src/interfaces/ContextMenuCommand.ts#L10)

___

### key

 **key**: `string`

#### Inherited from

Required.key

#### Defined in

[src/interfaces/ContextMenuCommand.ts:7](https://github.com/s809/noisecord/blob/777b7e5/src/interfaces/ContextMenuCommand.ts#L7)

___

### type

 **type**: `User` \| `Message`

#### Inherited from

Required.type

#### Defined in

[src/interfaces/ContextMenuCommand.ts:8](https://github.com/s809/noisecord/blob/777b7e5/src/interfaces/ContextMenuCommand.ts#L8)
