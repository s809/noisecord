[@s809/noisecord](../README.md) / [Exports](../modules.md) / ArgumentParseError

# Class: ArgumentParseError<TReason\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `TReason` | extends keyof [`CauseMap`](../modules/ArgumentParseError.md#causemap) = `any` |

## Hierarchy

- `Error`

  ↳ **`ArgumentParseError`**

## Table of contents

### Properties

- [cause](ArgumentParseError-1.md#cause)
- [message](ArgumentParseError-1.md#message)
- [name](ArgumentParseError-1.md#name)
- [stack](ArgumentParseError-1.md#stack)
- [prepareStackTrace](ArgumentParseError-1.md#preparestacktrace)
- [stackTraceLimit](ArgumentParseError-1.md#stacktracelimit)

### Methods

- [hasReason](ArgumentParseError-1.md#hasreason)
- [isSingle](ArgumentParseError-1.md#issingle)
- [captureStackTrace](ArgumentParseError-1.md#capturestacktrace)

## Properties

### cause

 `Readonly` **cause**: [`CauseMap`](../modules/ArgumentParseError.md#causemap)[`TReason`]

#### Inherited from

Error.cause

#### Defined in

[src/handlers/errors/ArgumentParseError.ts:9](https://github.com/s809/noisecord/blob/master/src/handlers/errors/ArgumentParseError.ts#L9)

___

### message

 `Readonly` **message**: `TReason`

#### Inherited from

Error.message

#### Defined in

[src/handlers/errors/ArgumentParseError.ts:7](https://github.com/s809/noisecord/blob/master/src/handlers/errors/ArgumentParseError.ts#L7)

___

### name

 **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1067

___

### stack

 `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1069

___

### prepareStackTrace

 `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

(`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

 `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### hasReason

**hasReason**<`T`\>(`reason`): this is ArgumentParseError<T\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends keyof [`SingleCauseMap`](../interfaces/ArgumentParseError.SingleCauseMap.md) \| ``"too_few_arguments"`` \| ``"too_many_arguments"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `reason` | `T` |

#### Returns

this is ArgumentParseError<T\>

#### Defined in

[src/handlers/errors/ArgumentParseError.ts:20](https://github.com/s809/noisecord/blob/master/src/handlers/errors/ArgumentParseError.ts#L20)

___

### isSingle

**isSingle**(): this is ArgumentParseError<Extract<TReason, keyof SingleCauseMap\>\>

#### Returns

this is ArgumentParseError<Extract<TReason, keyof SingleCauseMap\>\>

#### Defined in

[src/handlers/errors/ArgumentParseError.ts:16](https://github.com/s809/noisecord/blob/master/src/handlers/errors/ArgumentParseError.ts#L16)

___

### captureStackTrace

`Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4
