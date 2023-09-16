[@s809/noisecord](../README.md) / [Exports](../modules.md) / Translatable

# Namespace: Translatable

## Table of contents

### Type Aliases

- [Value](Translatable.md#value)

### Functions

- [translateValue](Translatable.md#translatevalue)

## Type Aliases

### Value

 **Value**<`T`, `TExcluded`\>: `T` extends `string` ? `string` \| [`PreparedTranslation`](../classes/PreparedTranslation.md) : `T` extends `TExcluded` ? `T` : `T` extends `object` ? { [K in keyof T]: Value<T[K], T\> } : `T`

Represents a translatable value.

**`Remarks`**

This type allows for the translation of strings or objects with translatable properties.
Strings will be translated directly, while objects will have their properties translated recursively.

**`Typeparam`**

T - The type of the value to translate.

**`Typeparam`**

TExcluded - A type to exclude from translation (avoids infinite recursion).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `TExcluded` | `never` |

#### Defined in

[src/translations/PreparedTranslation.ts:17](https://github.com/s809/noisecord/blob/master/src/translations/PreparedTranslation.ts#L17)

## Functions

### translateValue

**translateValue**<`T`\>(`value`): `T`

Translate a translatable value.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` \| `object` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | [`Value`](Translatable.md#value)<`T`, `never`\> | The translatable value to translate. |

#### Returns

`T`

The translated value.

**`Remarks`**

Translates the provided translatable value, which can be a string, an object with translatable properties,
or a PreparedTranslation instance.

#### Defined in

[src/translations/PreparedTranslation.ts:37](https://github.com/s809/noisecord/blob/master/src/translations/PreparedTranslation.ts#L37)
