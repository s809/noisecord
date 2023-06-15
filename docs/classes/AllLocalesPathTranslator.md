[@s809/noisecord](../README.md) / [Exports](../modules.md) / AllLocalesPathTranslator

# Class: AllLocalesPathTranslator

## Table of contents

### Properties

- [path](AllLocalesPathTranslator.md#path)

### Methods

- [getTranslation](AllLocalesPathTranslator.md#gettranslation)

## Properties

### path

 `Readonly` **path**: `string`

#### Defined in

[src/helpers/TranslationChecker.ts:28](https://github.com/s809/noisecord/blob/ab0ef27/src/helpers/TranslationChecker.ts#L28)

## Methods

### getTranslation

**getTranslation**(`context`, `args?`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`ContextResolvable`](../modules/TranslatorManager.md#contextresolvable) |
| `args?` | [`FormatParameters`](../modules/Translator.md#formatparameters) |

#### Returns

`Promise`<`string`\>

#### Defined in

[src/helpers/TranslationChecker.ts:30](https://github.com/s809/noisecord/blob/ab0ef27/src/helpers/TranslationChecker.ts#L30)

**getTranslation**(`context`, `args?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`Translator`](Translator-1.md) \| [`CommandRequest`](CommandRequest.md)<`boolean`, [`CommandResponse`](CommandResponse.md)\> |
| `args?` | [`FormatParameters`](../modules/Translator.md#formatparameters) |

#### Returns

`string`

#### Defined in

[src/helpers/TranslationChecker.ts:31](https://github.com/s809/noisecord/blob/ab0ef27/src/helpers/TranslationChecker.ts#L31)
