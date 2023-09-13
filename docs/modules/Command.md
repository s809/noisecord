[@s809/noisecord](../README.md) / [Exports](../modules.md) / Command

# Namespace: Command

## Table of contents

### Interfaces

- [ArgumentData](../interfaces/Command.ArgumentData.md)
- [InteractionCommandData](../interfaces/Command.InteractionCommandData.md)

### Type Aliases

- [Handler](Command.md#handler)
- [HandlerArguments](Command.md#handlerarguments)
- [PreparedTranslators](Command.md#preparedtranslators)

## Type Aliases

### Handler

 **Handler**<`OwnerOnly`, `AllowDMs`, `Args`, `Translations`\>: (`req`: `OwnerOnly` extends ``true`` ? [`MessageCommandRequest`](../classes/MessageCommandRequest.md)<[`AllowDMsInGuild`](../modules.md#allowdmsinguild)<`AllowDMs`\>\> : [`CommandRequest`](../classes/CommandRequest.md)<[`AllowDMsInGuild`](../modules.md#allowdmsinguild)<`AllowDMs`\>\>, `args`: `Args`, `translations?`: [`PreparedTranslators`](Command.md#preparedtranslators)<`Translations`\>) => `Awaitable`<`string` \| [`PreparedTranslation`](../classes/PreparedTranslation.md) \| `void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `OwnerOnly` | extends `boolean` = `boolean` |
| `AllowDMs` | extends `boolean` = `boolean` |
| `Args` | extends [`HandlerArguments`](Command.md#handlerarguments) = [`HandlerArguments`](Command.md#handlerarguments) |
| `Translations` | extends `Record`<`string`, `boolean`\> = `Record`<`string`, `boolean`\> |

#### Type declaration

(`req`, `args`, `translations?`): `Awaitable`<`string` \| [`PreparedTranslation`](../classes/PreparedTranslation.md) \| `void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `OwnerOnly` extends ``true`` ? [`MessageCommandRequest`](../classes/MessageCommandRequest.md)<[`AllowDMsInGuild`](../modules.md#allowdmsinguild)<`AllowDMs`\>\> : [`CommandRequest`](../classes/CommandRequest.md)<[`AllowDMsInGuild`](../modules.md#allowdmsinguild)<`AllowDMs`\>\> |
| `args` | `Args` |
| `translations?` | [`PreparedTranslators`](Command.md#preparedtranslators)<`Translations`\> |

##### Returns

`Awaitable`<`string` \| [`PreparedTranslation`](../classes/PreparedTranslation.md) \| `void`\>

#### Defined in

[src/interfaces/Command.ts:130](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L130)

___

### HandlerArguments

 **HandlerArguments**: `Record`<`string`, `string` \| `string`[] \| `number` \| `boolean` \| `User` \| `GuildTextBasedChannel` \| `Role` \| `undefined`\>

#### Defined in

[src/interfaces/Command.ts:115](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L115)

___

### PreparedTranslators

 **PreparedTranslators**<`Input`\>: `ConditionalSimplifyDeep`<[`UnionToIntersectionRecursive`](../modules.md#uniontointersectionrecursive)<{ [K in keyof Input as K extends \`${infer Head}.${any}\` ? Head : K]: K extends \`${string}.${infer Rest}\` ? PreparedTranslators<{ [K2 in Rest]: Input[K] }\> : K extends string ? IsLiteral<Input[K]\> extends true ? PreparedTranslation : never : never }\>, [`PreparedTranslation`](../classes/PreparedTranslation.md)\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Input` | extends `Record`<`string`, `boolean`\> |

#### Defined in

[src/interfaces/Command.ts:118](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L118)
