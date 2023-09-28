[@s809/noisecord](../README.md) / [Exports](../modules.md) / TranslationChecker

# Class: TranslationChecker

## Hierarchy

- [`ErrorCollector`](ErrorCollector.md)

  ↳ **`TranslationChecker`**

## Table of contents

### Accessors

- [groupChainLength](TranslationChecker-1.md#groupchainlength)

### Methods

- [addError](TranslationChecker-1.md#adderror)
- [checkTranslations](TranslationChecker-1.md#checktranslations)
- [setHeader](TranslationChecker-1.md#setheader)
- [throwIfErrors](TranslationChecker-1.md#throwiferrors)

## Accessors

### groupChainLength

`get` **groupChainLength**(): `number`

#### Returns

`number`

#### Inherited from

ErrorCollector.groupChainLength

#### Defined in

[src/helpers/ErrorCollector.ts:33](https://github.com/s809/noisecord/blob/master/src/helpers/ErrorCollector.ts#L33)

## Methods

### addError

**addError**(`message`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

`void`

#### Inherited from

[ErrorCollector](ErrorCollector.md).[addError](ErrorCollector.md#adderror)

#### Defined in

[src/helpers/ErrorCollector.ts:58](https://github.com/s809/noisecord/blob/master/src/helpers/ErrorCollector.ts#L58)

___

### checkTranslations

**checkTranslations**<`Paths`\>(`data`, `prefix?`): `ConditionalSimplifyDeep`<{ [K in string \| number \| symbol]: K extends \`${string}.${string}\` ? never : Paths[K] extends boolean ? any[any] extends true ? AllLocalesPathTranslator : DefaultLocalePathTranslator : ConditionalSimplifyDeep<({ [K in keyof Exclude<Paths[K], boolean\>]: K extends \`${string}.${string}\` ? never : Exclude<Paths[K], boolean\>[K] extends boolean ? Exclude<Paths[K], boolean\>[K] extends true ? AllLocalesPathTranslator : DefaultLocalePathTranslator : ConditionalSimplifyDeep<...\>; }), PathTranslatorTypes, unknown\> }, [`PathTranslatorTypes`](../modules/TranslationChecker.md#pathtranslatortypes), `unknown`\>

Converts provided object key paths into an easier to use object, and schedules them to be checked in later part of the initialization.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Paths` | extends [`DeeplyNestedObject`](../modules.md#deeplynestedobject)<`boolean`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Paths` | Object with keys of paths to check and values as indicators of whether to check all translators or only default. |
| `prefix?` | `string` | Prefix to use. |

#### Returns

`ConditionalSimplifyDeep`<{ [K in string \| number \| symbol]: K extends \`${string}.${string}\` ? never : Paths[K] extends boolean ? any[any] extends true ? AllLocalesPathTranslator : DefaultLocalePathTranslator : ConditionalSimplifyDeep<({ [K in keyof Exclude<Paths[K], boolean\>]: K extends \`${string}.${string}\` ? never : Exclude<Paths[K], boolean\>[K] extends boolean ? Exclude<Paths[K], boolean\>[K] extends true ? AllLocalesPathTranslator : DefaultLocalePathTranslator : ConditionalSimplifyDeep<...\>; }), PathTranslatorTypes, unknown\> }, [`PathTranslatorTypes`](../modules/TranslationChecker.md#pathtranslatortypes), `unknown`\>

Converted object.

#### Defined in

[src/translations/TranslationChecker.ts:79](https://github.com/s809/noisecord/blob/master/src/translations/TranslationChecker.ts#L79)

___

### setHeader

**setHeader**(`level`, `header`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `level` | `number` |
| `header` | `string` |

#### Returns

`void`

#### Inherited from

[ErrorCollector](ErrorCollector.md).[setHeader](ErrorCollector.md#setheader)

#### Defined in

[src/helpers/ErrorCollector.ts:47](https://github.com/s809/noisecord/blob/master/src/helpers/ErrorCollector.ts#L47)

___

### throwIfErrors

**throwIfErrors**(): `void`

#### Returns

`void`

#### Inherited from

[ErrorCollector](ErrorCollector.md).[throwIfErrors](ErrorCollector.md#throwiferrors)

#### Defined in

[src/helpers/ErrorCollector.ts:37](https://github.com/s809/noisecord/blob/master/src/helpers/ErrorCollector.ts#L37)
