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

[src/translations/TranslationChecker.ts:59](https://github.com/s809/noisecord/blob/master/src/translations/TranslationChecker.ts#L59)

___

### PathTranslators

 **PathTranslators**<`Input`\>: `ConditionalSimplifyDeep`<{ [K in keyof Input]: K extends \`${string}.${string}\` ? never : Input[K] extends boolean ? Input[K] extends true ? AllLocalesPathTranslator : DefaultLocalePathTranslator : PathTranslators<Exclude<Input[K], boolean\>\> }, [`PathTranslatorTypes`](TranslationChecker.md#pathtranslatortypes)\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Input` | extends [`DeeplyNestedObject`](../modules.md#deeplynestedobject)<`boolean`\> |

#### Defined in

[src/translations/TranslationChecker.ts:48](https://github.com/s809/noisecord/blob/master/src/translations/TranslationChecker.ts#L48)
