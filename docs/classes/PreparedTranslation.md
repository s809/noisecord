[@s809/noisecord](../README.md) / [Exports](../modules.md) / PreparedTranslation

# Class: PreparedTranslation

Represents context-specific translator, for a specific translation path.

## Table of contents

### Methods

- [translate](PreparedTranslation.md#translate)
- [withArgs](PreparedTranslation.md#withargs)

## Methods

### translate

**translate**(): `string`

Translates the prepared text using the provided Translator instance.

#### Returns

`string`

The translated text.

#### Defined in

[src/translations/PreparedTranslation.ts:32](https://github.com/s809/noisecord/blob/master/src/translations/PreparedTranslation.ts#L32)

___

### withArgs

**withArgs**(`args`): [`PreparedTranslation`](PreparedTranslation.md)

Create a new PreparedTranslator instance with updated format parameters.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | `Object` | The updated format parameters. |

#### Returns

[`PreparedTranslation`](PreparedTranslation.md)

A new PreparedTranslator instance with the specified format parameters.

#### Defined in

[src/translations/PreparedTranslation.ts:23](https://github.com/s809/noisecord/blob/master/src/translations/PreparedTranslation.ts#L23)
