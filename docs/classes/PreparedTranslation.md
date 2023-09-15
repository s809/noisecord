[@s809/noisecord](../README.md) / [Exports](../modules.md) / PreparedTranslation

# Class: PreparedTranslation

Represents context-specific translator, for a specific translation path.

## Table of contents

### Methods

- [translate](PreparedTranslation.md#translate)
- [withArgs](PreparedTranslation.md#withargs)
- [translate](PreparedTranslation.md#translate-1)

## Methods

### translate

**translate**(): `string`

Translates the prepared text using the provided Translator instance.

#### Returns

`string`

The translated text.

#### Defined in

[src/translations/PreparedTranslation.ts:53](https://github.com/s809/noisecord/blob/master/src/translations/PreparedTranslation.ts#L53)

___

### withArgs

**withArgs**(`args`): [`PreparedTranslation`](PreparedTranslation.md)

Create a new PreparedTranslator instance with updated format parameters.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | [`FormatParameters`](../modules/Translator.md#formatparameters) | The updated format parameters. |

#### Returns

[`PreparedTranslation`](PreparedTranslation.md)

A new PreparedTranslator instance with the specified format parameters.

#### Defined in

[src/translations/PreparedTranslation.ts:44](https://github.com/s809/noisecord/blob/master/src/translations/PreparedTranslation.ts#L44)

___

### translate

`Static` **translate**<`T`\>(`translatable`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` \| `object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `translatable` | [`Translatable`](../modules.md#translatable)<`T`, `never`\> |

#### Returns

`T`

#### Defined in

[src/translations/PreparedTranslation.ts:57](https://github.com/s809/noisecord/blob/master/src/translations/PreparedTranslation.ts#L57)
