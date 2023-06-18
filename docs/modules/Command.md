[@s809/noisecord](../README.md) / [Exports](../modules.md) / Command

# Namespace: Command

## Table of contents

### Interfaces

- [ArgumentData](../interfaces/Command.ArgumentData.md)
- [InteractionCommandData](../interfaces/Command.InteractionCommandData.md)

### Type Aliases

- [Handler](Command.md#handler)
- [HandlerArguments](Command.md#handlerarguments)

## Type Aliases

### Handler

 **Handler**<`OwnerOnly`, `AllowDMs`, `Args`\>: (`req`: `OwnerOnly` extends ``true`` ? [`MessageCommandRequest`](../classes/MessageCommandRequest.md)<[`AllowDMsInGuild`](../modules.md#allowdmsinguild)<`AllowDMs`\>\> : [`CommandRequest`](../classes/CommandRequest.md)<[`AllowDMsInGuild`](../modules.md#allowdmsinguild)<`AllowDMs`\>\>, `args`: `Args`) => `Awaitable`<`string` \| `void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `OwnerOnly` | extends `boolean` = `boolean` |
| `AllowDMs` | extends `boolean` = `boolean` |
| `Args` | extends [`HandlerArguments`](Command.md#handlerarguments) = [`HandlerArguments`](Command.md#handlerarguments) |

#### Type declaration

(`req`, `args`): `Awaitable`<`string` \| `void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `OwnerOnly` extends ``true`` ? [`MessageCommandRequest`](../classes/MessageCommandRequest.md)<[`AllowDMsInGuild`](../modules.md#allowdmsinguild)<`AllowDMs`\>\> : [`CommandRequest`](../classes/CommandRequest.md)<[`AllowDMsInGuild`](../modules.md#allowdmsinguild)<`AllowDMs`\>\> |
| `args` | `Args` |

##### Returns

`Awaitable`<`string` \| `void`\>

#### Defined in

[src/interfaces/Command.ts:102](https://github.com/s809/noisecord/blob/acabd79/src/interfaces/Command.ts#L102)

___

### HandlerArguments

 **HandlerArguments**: `Record`<`string`, `string` \| `string`[] \| `number` \| `boolean` \| `User` \| `GuildTextBasedChannel` \| `Role` \| `undefined`\>

#### Defined in

[src/interfaces/Command.ts:99](https://github.com/s809/noisecord/blob/acabd79/src/interfaces/Command.ts#L99)
