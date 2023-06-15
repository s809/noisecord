[@s809/noisecord](../README.md) / [Exports](../modules.md) / CommandDefinition

# Interface: CommandDefinition<OwnerOnly, AllowDMs, Args\>

Definition for a command.

## Type parameters

| Name | Type |
| :------ | :------ |
| `OwnerOnly` | extends `boolean` = `boolean` |
| `AllowDMs` | extends `boolean` = `boolean` |
| `Args` | extends readonly [`Argument`](../modules/CommandDefinition.md#argument)[] = readonly [`Argument`](../modules/CommandDefinition.md#argument)[] |

## Table of contents

### Properties

- [allowDMs](CommandDefinition-1.md#allowdms)
- [args](CommandDefinition-1.md#args)
- [conditions](CommandDefinition-1.md#conditions)
- [defaultMemberPermissions](CommandDefinition-1.md#defaultmemberpermissions)
- [handler](CommandDefinition-1.md#handler)
- [key](CommandDefinition-1.md#key)
- [ownerOnly](CommandDefinition-1.md#owneronly)

## Properties

### allowDMs

 `Optional` **allowDMs**: `AllowDMs`

#### Defined in

[src/interfaces/Command.ts:22](https://github.com/s809/noisecord/blob/50a8c6b/src/interfaces/Command.ts#L22)

___

### args

 `Optional` **args**: `Args`

#### Defined in

[src/interfaces/Command.ts:25](https://github.com/s809/noisecord/blob/50a8c6b/src/interfaces/Command.ts#L25)

___

### conditions

 `Optional` **conditions**: [`CommandCondition`](CommandCondition-1.md) \| [`CommandCondition`](CommandCondition-1.md)[]

#### Defined in

[src/interfaces/Command.ts:23](https://github.com/s809/noisecord/blob/50a8c6b/src/interfaces/Command.ts#L23)

___

### defaultMemberPermissions

 `Optional` **defaultMemberPermissions**: ``null`` \| `PermissionResolvable`

#### Defined in

[src/interfaces/Command.ts:21](https://github.com/s809/noisecord/blob/50a8c6b/src/interfaces/Command.ts#L21)

___

### handler

 `Optional` **handler**: [`Handler`](../modules/Command.md#handler)<`OwnerOnly`, `AllowDMs`, [`HandlerArguments`](../modules/CommandDefinition.md#handlerarguments)<`Args`\>\>

#### Defined in

[src/interfaces/Command.ts:26](https://github.com/s809/noisecord/blob/50a8c6b/src/interfaces/Command.ts#L26)

___

### key

 **key**: `string`

#### Defined in

[src/interfaces/Command.ts:18](https://github.com/s809/noisecord/blob/50a8c6b/src/interfaces/Command.ts#L18)

___

### ownerOnly

 `Optional` **ownerOnly**: `OwnerOnly`

#### Defined in

[src/interfaces/Command.ts:20](https://github.com/s809/noisecord/blob/50a8c6b/src/interfaces/Command.ts#L20)
