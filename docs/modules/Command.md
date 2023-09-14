[@s809/noisecord](../README.md) / [Exports](../modules.md) / Command

# Namespace: Command

## Table of contents

### Interfaces

- [ArgumentData](../interfaces/Command.ArgumentData.md)
- [InteractionCommandData](../interfaces/Command.InteractionCommandData.md)

### Type Aliases

- [Handler](Command.md#handler)
- [HandlerArguments](Command.md#handlerarguments)
- [PreparedTranslations](Command.md#preparedtranslations)

## Type Aliases

### Handler

 **Handler**<`OwnerOnly`, `AllowDMs`, `Args`, `Translations`\>: (`req`: `OwnerOnly` extends ``true`` ? [`MessageCommandRequest`](../classes/MessageCommandRequest.md)<[`AllowDMsInGuild`](../modules.md#allowdmsinguild)<`AllowDMs`\>\> : [`CommandRequest`](../classes/CommandRequest.md)<[`AllowDMsInGuild`](../modules.md#allowdmsinguild)<`AllowDMs`\>\>, `args`: `Args`, `translations`: [`PreparedTranslations`](Command.md#preparedtranslations)<`Translations`\>) => `Awaitable`<`string` \| [`PreparedTranslation`](../classes/PreparedTranslation.md) \| `void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `OwnerOnly` | extends `boolean` = `boolean` |
| `AllowDMs` | extends `boolean` = `boolean` |
| `Args` | extends [`HandlerArguments`](Command.md#handlerarguments) = [`HandlerArguments`](Command.md#handlerarguments) |
| `Translations` | extends [`DeeplyNestedObject`](../modules.md#deeplynestedobject)<`boolean`\> = [`DeeplyNestedObject`](../modules.md#deeplynestedobject)<`boolean`\> |

#### Type declaration

(`req`, `args`, `translations`): `Awaitable`<`string` \| [`PreparedTranslation`](../classes/PreparedTranslation.md) \| `void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `OwnerOnly` extends ``true`` ? [`MessageCommandRequest`](../classes/MessageCommandRequest.md)<[`AllowDMsInGuild`](../modules.md#allowdmsinguild)<`AllowDMs`\>\> : [`CommandRequest`](../classes/CommandRequest.md)<[`AllowDMsInGuild`](../modules.md#allowdmsinguild)<`AllowDMs`\>\> |
| `args` | `Args` |
| `translations` | [`PreparedTranslations`](Command.md#preparedtranslations)<`Translations`\> |

##### Returns

`Awaitable`<`string` \| [`PreparedTranslation`](../classes/PreparedTranslation.md) \| `void`\>

#### Defined in

[src/interfaces/Command.ts:129](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L129)

___

### HandlerArguments

 **HandlerArguments**: `Record`<`string`, `string` \| `string`[] \| `number` \| `boolean` \| `User` \| `GuildTextBasedChannel` \| `Role` \| `undefined`\>

#### Defined in

[src/interfaces/Command.ts:115](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L115)

___

### PreparedTranslations

 **PreparedTranslations**<`Input`\>: { [K in keyof Input]: K extends \`${string}.${string}\` ? never : Input[K] extends boolean ? PreparedTranslation : ConditionalSimplifyDeep<PreparedTranslations<Exclude<Input[K], boolean\>\>, PreparedTranslation\> }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Input` | extends [`DeeplyNestedObject`](../modules.md#deeplynestedobject)<`boolean`\> = [`DeeplyNestedObject`](../modules.md#deeplynestedobject)<`boolean`\> |

#### Defined in

[src/interfaces/Command.ts:118](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L118)
