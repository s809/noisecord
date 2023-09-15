[@s809/noisecord](../README.md) / [Exports](../modules.md) / PreparedTranslation

# Namespace: PreparedTranslation

## Table of contents

### Type Aliases

- [Translatable](PreparedTranslation.md#translatable)

## Type Aliases

### Translatable

 **Translatable**<`T`, `TExcluded`\>: `T` extends `string` ? `string` \| [`PreparedTranslation`](../classes/PreparedTranslation-1.md) : `T` extends `TExcluded` ? `T` : `T` extends `object` ? { [K in keyof T]: Translatable<T[K], T\> } : `T`

Represents a translatable type.

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

[src/translations/PreparedTranslation.ts:16](https://github.com/s809/noisecord/blob/master/src/translations/PreparedTranslation.ts#L16)
