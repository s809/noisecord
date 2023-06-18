[@s809/noisecord](../README.md) / [Exports](../modules.md) / TranslationChecker

# Namespace: TranslationChecker

## Table of contents

### Type Aliases

- [PathTranslatorTypes](TranslationChecker.md#pathtranslatortypes)
- [PathTranslators](TranslationChecker.md#pathtranslators)

## Type Aliases

### PathTranslatorTypes

 **PathTranslatorTypes**: [`DefaultLocalePathTranslator`](../classes/DefaultLocalePathTranslator.md) \| [`AllLocalesPathTranslator`](../classes/AllLocalesPathTranslator.md)

#### Defined in

[src/translations/TranslationChecker.ts:63](https://github.com/s809/noisecord/blob/777b7e5/src/translations/TranslationChecker.ts#L63)

___

### PathTranslators

 **PathTranslators**<`Input`\>: `ConditionalSimplifyDeep`<[`UnionToIntersectionRecursive`](../modules.md#uniontointersectionrecursive)<{ [K in keyof Input as K extends \`${infer Head}.${any}\` ? Head : K]: K extends \`${string}.${infer Rest}\` ? PathTranslators<{ [K2 in Rest]: Input[K] }\> : K extends string ? IsLiteral<Input[K]\> extends true ? Input[K] extends true ? AllLocalesPathTranslator : DefaultLocalePathTranslator : never : never }\>, [`PathTranslatorTypes`](TranslationChecker.md#pathtranslatortypes)\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Input` | extends `Record`<`string`, `boolean`\> |

#### Defined in

[src/translations/TranslationChecker.ts:49](https://github.com/s809/noisecord/blob/777b7e5/src/translations/TranslationChecker.ts#L49)
