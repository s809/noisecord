[@s809/noisecord](../README.md) / [Exports](../modules.md) / CommandCondition

# Interface: CommandCondition

Interface for adding a condition to a command.

## Table of contents

### Properties

- [check](CommandCondition.md#check)
- [key](CommandCondition.md#key)
- [requires](CommandCondition.md#requires)
- [satisfiedBy](CommandCondition.md#satisfiedby)

## Properties

### check

 **check**: (`context`: [`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>) => `boolean`

#### Type declaration

(`context`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\> |

##### Returns

`boolean`

#### Defined in

[src/conditions/index.ts:12](https://github.com/s809/noisecord/blob/b944b1f/src/conditions/index.ts#L12)

___

### key

 **key**: `string`

#### Defined in

[src/conditions/index.ts:11](https://github.com/s809/noisecord/blob/b944b1f/src/conditions/index.ts#L11)

___

### requires

 `Optional` **requires**: [`CommandCondition`](CommandCondition.md) \| [`CommandCondition`](CommandCondition.md)[]

#### Defined in

[src/conditions/index.ts:14](https://github.com/s809/noisecord/blob/b944b1f/src/conditions/index.ts#L14)

___

### satisfiedBy

 `Optional` **satisfiedBy**: [`CommandCondition`](CommandCondition.md) \| [`CommandCondition`](CommandCondition.md)[]

#### Defined in

[src/conditions/index.ts:13](https://github.com/s809/noisecord/blob/b944b1f/src/conditions/index.ts#L13)
