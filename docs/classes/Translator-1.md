[@s809/noisecord](../README.md) / [Exports](../modules.md) / Translator

# Class: Translator

Provides functions for translating text to a specific locale.

## Table of contents

### Properties

- [booleanValues](Translator-1.md#booleanvalues)
- [localeString](Translator-1.md#localestring)
- [root](Translator-1.md#root)
- [setLocaleRegex](Translator-1.md#setlocaleregex)

### Accessors

- [fallback](Translator-1.md#fallback)

### Methods

- [getTranslationFromRecord](Translator-1.md#gettranslationfromrecord)
- [translate](Translator-1.md#translate)
- [tryTranslate](Translator-1.md#trytranslate)

## Properties

### booleanValues

 `Readonly` **booleanValues**: [`string`[], `string`[]]

Array of arrays of translations of boolean values.
Index 0 - negative values (e.g. "false"),
index 1 - positive values (e.g. "true").

#### Defined in

[src/Translator.ts:31](https://github.com/s809/noisecord/blob/a1ec49a/src/Translator.ts#L31)

___

### localeString

 `Readonly` **localeString**: ``"id"`` \| ``"en-US"`` \| ``"en-GB"`` \| ``"bg"`` \| ``"zh-CN"`` \| ``"zh-TW"`` \| ``"hr"`` \| ``"cs"`` \| ``"da"`` \| ``"nl"`` \| ``"fi"`` \| ``"fr"`` \| ``"de"`` \| ``"el"`` \| ``"hi"`` \| ``"hu"`` \| ``"it"`` \| ``"ja"`` \| ``"ko"`` \| ``"lt"`` \| ``"no"`` \| ``"pl"`` \| ``"pt-BR"`` \| ``"ro"`` \| ``"ru"`` \| ``"es-ES"`` \| ``"sv-SE"`` \| ``"th"`` \| ``"tr"`` \| ``"uk"`` \| ``"vi"``

Contains locale to which everything will be translated to

#### Defined in

[src/Translator.ts:21](https://github.com/s809/noisecord/blob/a1ec49a/src/Translator.ts#L21)

___

### root

 `Readonly` **root**: ``null`` \| [`Translator`](Translator-1.md) = `null`

Translator of same locale without prefix.

#### Defined in

[src/Translator.ts:37](https://github.com/s809/noisecord/blob/a1ec49a/src/Translator.ts#L37)

___

### setLocaleRegex

 `Readonly` **setLocaleRegex**: `RegExp`

RegExp for setting locale of specified locale

#### Defined in

[src/Translator.ts:25](https://github.com/s809/noisecord/blob/a1ec49a/src/Translator.ts#L25)

## Accessors

### fallback

`get` **fallback**(): ``null`` \| [`Translator`](Translator-1.md)

Translator of fallback locale with same prefix.

#### Returns

``null`` \| [`Translator`](Translator-1.md)

#### Defined in

[src/Translator.ts:39](https://github.com/s809/noisecord/blob/a1ec49a/src/Translator.ts#L39)

## Methods

### getTranslationFromRecord

**getTranslationFromRecord**(`obj`): `any`

Gets a translation value from object using this translator's locale string as a key.
Tries to get result by a default locale key if this translator's key was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `obj` | `Partial`<`Record`<``"id"`` \| ``"en-US"`` \| ``"en-GB"`` \| ``"bg"`` \| ``"zh-CN"`` \| ``"zh-TW"`` \| ``"hr"`` \| ``"cs"`` \| ``"da"`` \| ``"nl"`` \| ``"fi"`` \| ``"fr"`` \| ``"de"`` \| ``"el"`` \| ``"hi"`` \| ``"hu"`` \| ``"it"`` \| ``"ja"`` \| ``"ko"`` \| ``"lt"`` \| ``"no"`` \| ``"pl"`` \| ``"pt-BR"`` \| ``"ro"`` \| ``"ru"`` \| ``"es-ES"`` \| ``"sv-SE"`` \| ``"th"`` \| ``"tr"`` \| ``"uk"`` \| ``"vi"``, `any`\>\> | Object to get value from. |

#### Returns

`any`

Value from object or undefined.

#### Defined in

[src/Translator.ts:120](https://github.com/s809/noisecord/blob/a1ec49a/src/Translator.ts#L120)

___

### translate

**translate**(`path`, `args?`): `string`

Get a translation string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` | Path of translation entry. |
| `args?` | [`FormatParameters`](../modules/Translator.md#formatparameters) | Arguments for string interpolation. |

#### Returns

`string`

String with translation or passed path, if it was not found.

#### Defined in

[src/Translator.ts:90](https://github.com/s809/noisecord/blob/a1ec49a/src/Translator.ts#L90)

___

### tryTranslate

**tryTranslate**(`path`, `args?`): ``null`` \| `string`

Get a translation string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` | Path of translation entry. |
| `args` | [`FormatParameters`](../modules/Translator.md#formatparameters) | Arguments for string interpolation. |

#### Returns

``null`` \| `string`

String with translation or null, if it was not found.

#### Defined in

[src/Translator.ts:108](https://github.com/s809/noisecord/blob/a1ec49a/src/Translator.ts#L108)
