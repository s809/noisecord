[@s809/noisecord](../README.md) / [Exports](../modules.md) / InteractionHandlerOptions

# Interface: InteractionHandlerOptions

Options for setting up an interaction handler.

## Hierarchy

- `Partial`<[`EventHandlerOptions`](EventHandlerOptions.md)<[`InteractionCommandRequest`](../classes/InteractionCommandRequest.md)<`any`, `any`\>\>\>

  ↳ **`InteractionHandlerOptions`**

## Table of contents

### Properties

- [onConditionsUnsatisfied](InteractionHandlerOptions.md#onconditionsunsatisfied)
- [onFailure](InteractionHandlerOptions.md#onfailure)
- [onInvalidArguments](InteractionHandlerOptions.md#oninvalidarguments)
- [onSlowCommand](InteractionHandlerOptions.md#onslowcommand)
- [onSuccess](InteractionHandlerOptions.md#onsuccess)
- [registerApplicationCommands](InteractionHandlerOptions.md#registerapplicationcommands)
- [slowCommandDelayMs](InteractionHandlerOptions.md#slowcommanddelayms)

## Properties

### onConditionsUnsatisfied

 `Optional` **onConditionsUnsatisfied**: (`this`: [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\>, `req`: [`InteractionCommandRequest`](../classes/InteractionCommandRequest.md)<`any`, `any`\>, `key`: `string`, `translator`: [`Translator`](../classes/Translator-1.md)) => `Awaitable`<`void`\>

#### Type declaration

(`this`, `req`, `key`, `translator`): `Awaitable`<`void`\>

Called if the command was attempted to run and conditions were not satisfied.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\> |
| `req` | [`InteractionCommandRequest`](../classes/InteractionCommandRequest.md)<`any`, `any`\> |
| `key` | `string` |
| `translator` | [`Translator`](../classes/Translator-1.md) |

##### Returns

`Awaitable`<`void`\>

#### Inherited from

Partial.onConditionsUnsatisfied

#### Defined in

[src/handlers/EventHandlerOptions.ts:35](https://github.com/s809/noisecord/blob/37daa76/src/handlers/EventHandlerOptions.ts#L35)

___

### onFailure

 `Optional` **onFailure**: (`this`: [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\>, `req`: [`InteractionCommandRequest`](../classes/InteractionCommandRequest.md)<`any`, `any`\>, `error`: `Error`) => `Awaitable`<`void`\>

#### Type declaration

(`this`, `req`, `error`): `Awaitable`<`void`\>

Called if the command returned a value other than `undefined` or threw an exception.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\> |
| `req` | [`InteractionCommandRequest`](../classes/InteractionCommandRequest.md)<`any`, `any`\> |
| `error` | `Error` |

##### Returns

`Awaitable`<`void`\>

#### Inherited from

Partial.onFailure

#### Defined in

[src/handlers/EventHandlerOptions.ts:25](https://github.com/s809/noisecord/blob/37daa76/src/handlers/EventHandlerOptions.ts#L25)

___

### onInvalidArguments

 `Optional` **onInvalidArguments**: (`this`: [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\>, `req`: [`InteractionCommandRequest`](../classes/InteractionCommandRequest.md)<`any`, `any`\>, `command`: [`Command`](Command-1.md), `e`: [`ArgumentParseError`](../classes/ArgumentParseError-1.md)<`any`\>, `translator`: [`Translator`](../classes/Translator-1.md)) => `Awaitable`<`void`\>

#### Type declaration

(`this`, `req`, `command`, `e`, `translator`): `Awaitable`<`void`\>

Called if the command received invalid arguments.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\> |
| `req` | [`InteractionCommandRequest`](../classes/InteractionCommandRequest.md)<`any`, `any`\> |
| `command` | [`Command`](Command-1.md) |
| `e` | [`ArgumentParseError`](../classes/ArgumentParseError-1.md)<`any`\> |
| `translator` | [`Translator`](../classes/Translator-1.md) |

##### Returns

`Awaitable`<`void`\>

#### Inherited from

Partial.onInvalidArguments

#### Defined in

[src/handlers/EventHandlerOptions.ts:30](https://github.com/s809/noisecord/blob/37daa76/src/handlers/EventHandlerOptions.ts#L30)

___

### onSlowCommand

 `Optional` **onSlowCommand**: (`this`: [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\>, `req`: [`InteractionCommandRequest`](../classes/InteractionCommandRequest.md)<`any`, `any`\>) => `Awaitable`<`void`\>

#### Type declaration

(`this`, `req`): `Awaitable`<`void`\>

Called if the command did not complete before a specified delay (default is 1000ms).

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\> |
| `req` | [`InteractionCommandRequest`](../classes/InteractionCommandRequest.md)<`any`, `any`\> |

##### Returns

`Awaitable`<`void`\>

#### Inherited from

Partial.onSlowCommand

#### Defined in

[src/handlers/EventHandlerOptions.ts:15](https://github.com/s809/noisecord/blob/37daa76/src/handlers/EventHandlerOptions.ts#L15)

___

### onSuccess

 `Optional` **onSuccess**: (`this`: [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\>, `req`: [`InteractionCommandRequest`](../classes/InteractionCommandRequest.md)<`any`, `any`\>) => `Awaitable`<`void`\>

#### Type declaration

(`this`, `req`): `Awaitable`<`void`\>

Called if the command returned `undefined`.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\> |
| `req` | [`InteractionCommandRequest`](../classes/InteractionCommandRequest.md)<`any`, `any`\> |

##### Returns

`Awaitable`<`void`\>

#### Inherited from

Partial.onSuccess

#### Defined in

[src/handlers/EventHandlerOptions.ts:20](https://github.com/s809/noisecord/blob/37daa76/src/handlers/EventHandlerOptions.ts#L20)

___

### registerApplicationCommands

 `Optional` **registerApplicationCommands**: `boolean`

#### Defined in

[src/handlers/Interaction/InteractionHandler.ts:19](https://github.com/s809/noisecord/blob/37daa76/src/handlers/Interaction/InteractionHandler.ts#L19)

___

### slowCommandDelayMs

 `Optional` **slowCommandDelayMs**: `number`

#### Inherited from

Partial.slowCommandDelayMs

#### Defined in

[src/handlers/EventHandlerOptions.ts:10](https://github.com/s809/noisecord/blob/37daa76/src/handlers/EventHandlerOptions.ts#L10)
