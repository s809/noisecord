[@s809/noisecord](../README.md) / [Exports](../modules.md) / [ArgumentParseError](../modules/ArgumentParseError.md) / SingleCauseMap

# Interface: SingleCauseMap

[ArgumentParseError](../modules/ArgumentParseError.md).SingleCauseMap

## Table of contents

### Properties

- [channel\_constraints\_not\_met](ArgumentParseError.SingleCauseMap.md#channel_constraints_not_met)
- [invalid\_channel](ArgumentParseError.SingleCauseMap.md#invalid_channel)
- [invalid\_numeric](ArgumentParseError.SingleCauseMap.md#invalid_numeric)
- [invalid\_role](ArgumentParseError.SingleCauseMap.md#invalid_role)
- [invalid\_user](ArgumentParseError.SingleCauseMap.md#invalid_user)
- [unsupported\_argument\_type](ArgumentParseError.SingleCauseMap.md#unsupported_argument_type)
- [value\_not\_allowed](ArgumentParseError.SingleCauseMap.md#value_not_allowed)
- [value\_too\_large](ArgumentParseError.SingleCauseMap.md#value_too_large)
- [value\_too\_long](ArgumentParseError.SingleCauseMap.md#value_too_long)
- [value\_too\_short](ArgumentParseError.SingleCauseMap.md#value_too_short)
- [value\_too\_small](ArgumentParseError.SingleCauseMap.md#value_too_small)

## Properties

### channel\_constraints\_not\_met

 **channel\_constraints\_not\_met**: `Object`

#### Defined in

[src/handlers/errors/ArgumentParseError.ts:62](https://github.com/s809/noisecord/blob/5de1f63/src/handlers/errors/ArgumentParseError.ts#L62)

___

### invalid\_channel

 **invalid\_channel**: `Object`

#### Defined in

[src/handlers/errors/ArgumentParseError.ts:61](https://github.com/s809/noisecord/blob/5de1f63/src/handlers/errors/ArgumentParseError.ts#L61)

___

### invalid\_numeric

 **invalid\_numeric**: `Object`

#### Defined in

[src/handlers/errors/ArgumentParseError.ts:44](https://github.com/s809/noisecord/blob/5de1f63/src/handlers/errors/ArgumentParseError.ts#L44)

___

### invalid\_role

 **invalid\_role**: `Object`

#### Defined in

[src/handlers/errors/ArgumentParseError.ts:64](https://github.com/s809/noisecord/blob/5de1f63/src/handlers/errors/ArgumentParseError.ts#L64)

___

### invalid\_user

 **invalid\_user**: `Object`

#### Defined in

[src/handlers/errors/ArgumentParseError.ts:63](https://github.com/s809/noisecord/blob/5de1f63/src/handlers/errors/ArgumentParseError.ts#L63)

___

### unsupported\_argument\_type

 **unsupported\_argument\_type**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `type` | `string` |

#### Defined in

[src/handlers/errors/ArgumentParseError.ts:65](https://github.com/s809/noisecord/blob/5de1f63/src/handlers/errors/ArgumentParseError.ts#L65)

___

### value\_not\_allowed

 **value\_not\_allowed**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `allowedValues` | `string` |
| `allowedValuesItems` | `string`[] |

#### Defined in

[src/handlers/errors/ArgumentParseError.ts:45](https://github.com/s809/noisecord/blob/5de1f63/src/handlers/errors/ArgumentParseError.ts#L45)

___

### value\_too\_large

 **value\_too\_large**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `maxValue` | `number` |

#### Defined in

[src/handlers/errors/ArgumentParseError.ts:52](https://github.com/s809/noisecord/blob/5de1f63/src/handlers/errors/ArgumentParseError.ts#L52)

___

### value\_too\_long

 **value\_too\_long**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `maxLength` | `number` |

#### Defined in

[src/handlers/errors/ArgumentParseError.ts:58](https://github.com/s809/noisecord/blob/5de1f63/src/handlers/errors/ArgumentParseError.ts#L58)

___

### value\_too\_short

 **value\_too\_short**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `minLength` | `number` |

#### Defined in

[src/handlers/errors/ArgumentParseError.ts:55](https://github.com/s809/noisecord/blob/5de1f63/src/handlers/errors/ArgumentParseError.ts#L55)

___

### value\_too\_small

 **value\_too\_small**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `minValue` | `number` |

#### Defined in

[src/handlers/errors/ArgumentParseError.ts:49](https://github.com/s809/noisecord/blob/5de1f63/src/handlers/errors/ArgumentParseError.ts#L49)
