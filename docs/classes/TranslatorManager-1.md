[@s809/noisecord](../README.md) / [Exports](../modules.md) / TranslatorManager

# Class: TranslatorManager

## Table of contents

### Constructors

- [constructor](TranslatorManager-1.md#constructor)

### Properties

- [rootTranslators](TranslatorManager-1.md#roottranslators)
- [setLocaleRegexes](TranslatorManager-1.md#setlocaleregexes)
- [defaultDiscordLocale](TranslatorManager-1.md#defaultdiscordlocale)

### Accessors

- [fallbackLocale](TranslatorManager-1.md#fallbacklocale)
- [fallbackTranslator](TranslatorManager-1.md#fallbacktranslator)

### Methods

- [getLocale](TranslatorManager-1.md#getlocale)
- [getLocalizations](TranslatorManager-1.md#getlocalizations)
- [getTranslator](TranslatorManager-1.md#gettranslator)

## Constructors

### constructor

**new TranslatorManager**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`TranslatorManagerOptions`](../interfaces/TranslatorManagerOptions.md) |

#### Defined in

[src/translations/TranslatorManager.ts:42](https://github.com/s809/noisecord/blob/b944b1f/src/translations/TranslatorManager.ts#L42)

## Properties

### rootTranslators

 `Readonly` **rootTranslators**: [`Translator`](Translator-1.md)[] = `[]`

#### Defined in

[src/translations/TranslatorManager.ts:32](https://github.com/s809/noisecord/blob/b944b1f/src/translations/TranslatorManager.ts#L32)

___

### setLocaleRegexes

 `Readonly` **setLocaleRegexes**: `Record`<``"id"`` \| ``"en-US"`` \| ``"en-GB"`` \| ``"bg"`` \| ``"zh-CN"`` \| ``"zh-TW"`` \| ``"hr"`` \| ``"cs"`` \| ``"da"`` \| ``"nl"`` \| ``"fi"`` \| ``"fr"`` \| ``"de"`` \| ``"el"`` \| ``"hi"`` \| ``"hu"`` \| ``"it"`` \| ``"ja"`` \| ``"ko"`` \| ``"lt"`` \| ``"no"`` \| ``"pl"`` \| ``"pt-BR"`` \| ``"ro"`` \| ``"ru"`` \| ``"es-ES"`` \| ``"sv-SE"`` \| ``"th"`` \| ``"tr"`` \| ``"uk"`` \| ``"vi"``, `RegExp`\>

#### Defined in

[src/translations/TranslatorManager.ts:31](https://github.com/s809/noisecord/blob/b944b1f/src/translations/TranslatorManager.ts#L31)

___

### defaultDiscordLocale

 `Static` `Readonly` **defaultDiscordLocale**: ``"id"`` \| ``"en-US"`` \| ``"en-GB"`` \| ``"bg"`` \| ``"zh-CN"`` \| ``"zh-TW"`` \| ``"hr"`` \| ``"cs"`` \| ``"da"`` \| ``"nl"`` \| ``"fi"`` \| ``"fr"`` \| ``"de"`` \| ``"el"`` \| ``"hi"`` \| ``"hu"`` \| ``"it"`` \| ``"ja"`` \| ``"ko"`` \| ``"lt"`` \| ``"no"`` \| ``"pl"`` \| ``"pt-BR"`` \| ``"ro"`` \| ``"ru"`` \| ``"es-ES"`` \| ``"sv-SE"`` \| ``"th"`` \| ``"tr"`` \| ``"uk"`` \| ``"vi"`` = `"en-US"`

#### Defined in

[src/translations/TranslatorManager.ts:27](https://github.com/s809/noisecord/blob/b944b1f/src/translations/TranslatorManager.ts#L27)

## Accessors

### fallbackLocale

`get` **fallbackLocale**(): ``"id"`` \| ``"en-US"`` \| ``"en-GB"`` \| ``"bg"`` \| ``"zh-CN"`` \| ``"zh-TW"`` \| ``"hr"`` \| ``"cs"`` \| ``"da"`` \| ``"nl"`` \| ``"fi"`` \| ``"fr"`` \| ``"de"`` \| ``"el"`` \| ``"hi"`` \| ``"hu"`` \| ``"it"`` \| ``"ja"`` \| ``"ko"`` \| ``"lt"`` \| ``"no"`` \| ``"pl"`` \| ``"pt-BR"`` \| ``"ro"`` \| ``"ru"`` \| ``"es-ES"`` \| ``"sv-SE"`` \| ``"th"`` \| ``"tr"`` \| ``"uk"`` \| ``"vi"``

#### Returns

``"id"`` \| ``"en-US"`` \| ``"en-GB"`` \| ``"bg"`` \| ``"zh-CN"`` \| ``"zh-TW"`` \| ``"hr"`` \| ``"cs"`` \| ``"da"`` \| ``"nl"`` \| ``"fi"`` \| ``"fr"`` \| ``"de"`` \| ``"el"`` \| ``"hi"`` \| ``"hu"`` \| ``"it"`` \| ``"ja"`` \| ``"ko"`` \| ``"lt"`` \| ``"no"`` \| ``"pl"`` \| ``"pt-BR"`` \| ``"ro"`` \| ``"ru"`` \| ``"es-ES"`` \| ``"sv-SE"`` \| ``"th"`` \| ``"tr"`` \| ``"uk"`` \| ``"vi"``

#### Defined in

[src/translations/TranslatorManager.ts:34](https://github.com/s809/noisecord/blob/b944b1f/src/translations/TranslatorManager.ts#L34)

___

### fallbackTranslator

`get` **fallbackTranslator**(): [`Translator`](Translator-1.md)

#### Returns

[`Translator`](Translator-1.md)

#### Defined in

[src/translations/TranslatorManager.ts:37](https://github.com/s809/noisecord/blob/b944b1f/src/translations/TranslatorManager.ts#L37)

## Methods

### getLocale

**getLocale**(`nameOrContext`): `Promise`<``null`` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `nameOrContext` | [`ContextResolvable`](../modules/TranslatorManager.md#contextresolvable) |

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[src/translations/TranslatorManager.ts:110](https://github.com/s809/noisecord/blob/b944b1f/src/translations/TranslatorManager.ts#L110)

___

### getLocalizations

**getLocalizations**(`translationPath`): `Partial`<`Record`<``"id"`` \| ``"en-US"`` \| ``"en-GB"`` \| ``"bg"`` \| ``"zh-CN"`` \| ``"zh-TW"`` \| ``"hr"`` \| ``"cs"`` \| ``"da"`` \| ``"nl"`` \| ``"fi"`` \| ``"fr"`` \| ``"de"`` \| ``"el"`` \| ``"hi"`` \| ``"hu"`` \| ``"it"`` \| ``"ja"`` \| ``"ko"`` \| ``"lt"`` \| ``"no"`` \| ``"pl"`` \| ``"pt-BR"`` \| ``"ro"`` \| ``"ru"`` \| ``"es-ES"`` \| ``"sv-SE"`` \| ``"th"`` \| ``"tr"`` \| ``"uk"`` \| ``"vi"``, `string`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `translationPath` | `string` |

#### Returns

`Partial`<`Record`<``"id"`` \| ``"en-US"`` \| ``"en-GB"`` \| ``"bg"`` \| ``"zh-CN"`` \| ``"zh-TW"`` \| ``"hr"`` \| ``"cs"`` \| ``"da"`` \| ``"nl"`` \| ``"fi"`` \| ``"fr"`` \| ``"de"`` \| ``"el"`` \| ``"hi"`` \| ``"hu"`` \| ``"it"`` \| ``"ja"`` \| ``"ko"`` \| ``"lt"`` \| ``"no"`` \| ``"pl"`` \| ``"pt-BR"`` \| ``"ro"`` \| ``"ru"`` \| ``"es-ES"`` \| ``"sv-SE"`` \| ``"th"`` \| ``"tr"`` \| ``"uk"`` \| ``"vi"``, `string`\>\>

#### Defined in

[src/translations/TranslatorManager.ts:180](https://github.com/s809/noisecord/blob/b944b1f/src/translations/TranslatorManager.ts#L180)

___

### getTranslator

**getTranslator**(`nameOrContext`, `prefix?`): `Promise`<[`Translator`](Translator-1.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `nameOrContext` | [`ContextResolvable`](../modules/TranslatorManager.md#contextresolvable) |
| `prefix?` | `string` |

#### Returns

`Promise`<[`Translator`](Translator-1.md)\>

#### Defined in

[src/translations/TranslatorManager.ts:160](https://github.com/s809/noisecord/blob/b944b1f/src/translations/TranslatorManager.ts#L160)
