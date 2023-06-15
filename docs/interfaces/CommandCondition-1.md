[@s809/noisecord](../README.md) / [Exports](../modules.md) / CommandCondition

# Interface: CommandCondition

Interface for adding a condition to a command.

## Table of contents

### Properties

- [check](CommandCondition-1.md#check)
- [hideInDescription](CommandCondition-1.md#hideindescription)
- [key](CommandCondition-1.md#key)
- [requires](CommandCondition-1.md#requires)
- [satisfiedBy](CommandCondition-1.md#satisfiedby)

## Properties

### check

 **check**: (`context`: [`ContextResolvable`](../modules/CommandCondition.md#contextresolvable)) => `boolean`

#### Type declaration

(`context`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`ContextResolvable`](../modules/CommandCondition.md#contextresolvable) |

##### Returns

`boolean`

#### Defined in

[src/conditions/index.ts:13](https://github.com/s809/noisecord/blob/6d7ed8b/src/conditions/index.ts#L13)

___

### hideInDescription

 `Optional` **hideInDescription**: `boolean`

#### Defined in

[src/conditions/index.ts:14](https://github.com/s809/noisecord/blob/6d7ed8b/src/conditions/index.ts#L14)

___

### key

 **key**: `string`

#### Defined in

[src/conditions/index.ts:12](https://github.com/s809/noisecord/blob/6d7ed8b/src/conditions/index.ts#L12)

___

### requires

 `Optional` **requires**: [`CommandCondition`](CommandCondition-1.md) \| [`CommandCondition`](CommandCondition-1.md)[]

#### Defined in

[src/conditions/index.ts:16](https://github.com/s809/noisecord/blob/6d7ed8b/src/conditions/index.ts#L16)

___

### satisfiedBy

 `Optional` **satisfiedBy**: [`CommandCondition`](CommandCondition-1.md) \| [`CommandCondition`](CommandCondition-1.md)[]

#### Defined in

[src/conditions/index.ts:15](https://github.com/s809/noisecord/blob/6d7ed8b/src/conditions/index.ts#L15)
