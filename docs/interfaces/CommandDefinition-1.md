[@s809/noisecord](../README.md) / [Exports](../modules.md) / CommandDefinition

# Interface: CommandDefinition<OwnerOnly, AllowDMs, Args, Translations\>

Definition for a command.

## Type parameters

| Name | Type |
| :------ | :------ |
| `OwnerOnly` | extends `boolean` = `boolean` |
| `AllowDMs` | extends `boolean` = `boolean` |
| `Args` | extends readonly [`Argument`](../modules/CommandDefinition.md#argument)[] = readonly [`Argument`](../modules/CommandDefinition.md#argument)[] |
| `Translations` | extends [`DeeplyNestedObject`](../modules.md#deeplynestedobject)<`boolean`\> = [`DeeplyNestedObject`](../modules.md#deeplynestedobject)<`boolean`\> |

## Table of contents

### Properties

- [allowDMs](CommandDefinition-1.md#allowdms)
- [args](CommandDefinition-1.md#args)
- [conditions](CommandDefinition-1.md#conditions)
- [defaultMemberPermissions](CommandDefinition-1.md#defaultmemberpermissions)
- [handler](CommandDefinition-1.md#handler)
- [key](CommandDefinition-1.md#key)
- [ownerOnly](CommandDefinition-1.md#owneronly)
- [translations](CommandDefinition-1.md#translations)

## Properties

### allowDMs

 `Optional` **allowDMs**: `AllowDMs`

#### Defined in

[src/interfaces/Command.ts:29](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L29)

___

### args

 `Optional` **args**: `Args`

#### Defined in

[src/interfaces/Command.ts:34](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L34)

___

### conditions

 `Optional` **conditions**: [`CommandCondition`](CommandCondition.md) \| [`CommandCondition`](CommandCondition.md)[]

#### Defined in

[src/interfaces/Command.ts:30](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L30)

___

### defaultMemberPermissions

 `Optional` **defaultMemberPermissions**: ``null`` \| `PermissionResolvable`

#### Defined in

[src/interfaces/Command.ts:28](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L28)

___

### handler

 `Optional` **handler**: [`Handler`](../modules/Command.md#handler)<`OwnerOnly`, `AllowDMs`, [`HandlerArguments`](../modules/CommandDefinition.md#handlerarguments)<`Args`\>, `Translations`\>

#### Defined in

[src/interfaces/Command.ts:35](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L35)

___

### key

 **key**: `string`

#### Defined in

[src/interfaces/Command.ts:25](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L25)

___

### ownerOnly

 `Optional` **ownerOnly**: `OwnerOnly`

#### Defined in

[src/interfaces/Command.ts:27](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L27)

___

### translations

 `Optional` **translations**: `Translations`

#### Defined in

[src/interfaces/Command.ts:32](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L32)
