[@s809/noisecord](../README.md) / [Exports](../modules.md) / PreparedTranslation

# Class: PreparedTranslation

Represents context-specific translator, for a specific translation path.

## Table of contents

### Methods

- [translate](PreparedTranslation-1.md#translate)
- [withArgs](PreparedTranslation-1.md#withargs)
- [translate](PreparedTranslation-1.md#translate-1)

## Methods

### translate

**translate**(): `string`

Translates the prepared text using the provided Translator instance.

#### Returns

`string`

The translated text.

#### Defined in

[src/translations/PreparedTranslation.ts:56](https://github.com/s809/noisecord/blob/master/src/translations/PreparedTranslation.ts#L56)

___

### withArgs

**withArgs**(`args`): [`PreparedTranslation`](PreparedTranslation-1.md)

Create a new PreparedTranslator instance with updated format parameters.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | [`FormatParameters`](../modules/Translator.md#formatparameters) | The updated format parameters. |

#### Returns

[`PreparedTranslation`](PreparedTranslation-1.md)

A new PreparedTranslator instance with the specified format parameters.

#### Defined in

[src/translations/PreparedTranslation.ts:47](https://github.com/s809/noisecord/blob/master/src/translations/PreparedTranslation.ts#L47)

___

### translate

`Static` **translate**<`T`\>(`translatable`): `T`

Translate a translatable value.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` \| `object` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `translatable` | [`Translatable`](../modules/PreparedTranslation.md#translatable)<`T`, `never`\> | The translatable value to translate. |

#### Returns

`T`

The translated value.

**`Remarks`**

Translates the provided translatable value, which can be a string, an object with translatable properties,
or a PreparedTranslation instance.

#### Defined in

[src/translations/PreparedTranslation.ts:70](https://github.com/s809/noisecord/blob/master/src/translations/PreparedTranslation.ts#L70)
