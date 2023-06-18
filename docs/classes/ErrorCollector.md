[@s809/noisecord](../README.md) / [Exports](../modules.md) / ErrorCollector

# Class: ErrorCollector

## Hierarchy

- **`ErrorCollector`**

  ↳ [`TranslationChecker`](TranslationChecker-1.md)

## Table of contents

### Constructors

- [constructor](ErrorCollector.md#constructor)

### Accessors

- [groupChainLength](ErrorCollector.md#groupchainlength)

### Methods

- [addError](ErrorCollector.md#adderror)
- [setHeader](ErrorCollector.md#setheader)
- [throwIfErrors](ErrorCollector.md#throwiferrors)

## Constructors

### constructor

**new ErrorCollector**(`errorMessage?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `errorMessage?` | `string` |

#### Defined in

[src/helpers/ErrorCollector.ts:31](https://github.com/s809/noisecord/blob/acabd79/src/helpers/ErrorCollector.ts#L31)

## Accessors

### groupChainLength

`get` **groupChainLength**(): `number`

#### Returns

`number`

#### Defined in

[src/helpers/ErrorCollector.ts:33](https://github.com/s809/noisecord/blob/acabd79/src/helpers/ErrorCollector.ts#L33)

## Methods

### addError

**addError**(`message`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

`void`

#### Defined in

[src/helpers/ErrorCollector.ts:58](https://github.com/s809/noisecord/blob/acabd79/src/helpers/ErrorCollector.ts#L58)

___

### setHeader

**setHeader**(`level`, `header`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `level` | `number` |
| `header` | `string` |

#### Returns

`void`

#### Defined in

[src/helpers/ErrorCollector.ts:47](https://github.com/s809/noisecord/blob/acabd79/src/helpers/ErrorCollector.ts#L47)

___

### throwIfErrors

**throwIfErrors**(): `void`

#### Returns

`void`

#### Defined in

[src/helpers/ErrorCollector.ts:37](https://github.com/s809/noisecord/blob/acabd79/src/helpers/ErrorCollector.ts#L37)
