[@s809/noisecord](../README.md) / [Exports](../modules.md) / EventHandlerOptions

# Interface: EventHandlerOptions<TCommandRequest\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `TCommandRequest` | [`CommandRequest`](../classes/CommandRequest.md) |

## Table of contents

### Properties

- [onFailure](EventHandlerOptions.md#onfailure)
- [onInvalidArguments](EventHandlerOptions.md#oninvalidarguments)
- [onSlowCommand](EventHandlerOptions.md#onslowcommand)
- [onSuccess](EventHandlerOptions.md#onsuccess)
- [slowCommandDelayMs](EventHandlerOptions.md#slowcommanddelayms)

## Properties

### onFailure

 **onFailure**: (`this`: [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\>, `req`: `TCommandRequest`, `error`: `Error`) => `Awaitable`<`void`\>

#### Type declaration

(`this`, `req`, `error`): `Awaitable`<`void`\>

Called if the command returned a value other than `undefined` or threw an exception.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\> |
| `req` | `TCommandRequest` |
| `error` | `Error` |

##### Returns

`Awaitable`<`void`\>

#### Defined in

[src/handlers/EventHandlerOptions.ts:25](https://github.com/s809/noisecord/blob/9cb1c4e/src/handlers/EventHandlerOptions.ts#L25)

___

### onInvalidArguments

 **onInvalidArguments**: (`this`: [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\>, `req`: `TCommandRequest`, `command`: [`Command`](Command-1.md), `e`: [`ArgumentParseError`](../classes/ArgumentParseError-1.md)<`any`\>, `translator`: [`Translator`](../classes/Translator-1.md)) => `Awaitable`<`void`\>

#### Type declaration

(`this`, `req`, `command`, `e`, `translator`): `Awaitable`<`void`\>

Called if the command received invalid arguments.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\> |
| `req` | `TCommandRequest` |
| `command` | [`Command`](Command-1.md) |
| `e` | [`ArgumentParseError`](../classes/ArgumentParseError-1.md)<`any`\> |
| `translator` | [`Translator`](../classes/Translator-1.md) |

##### Returns

`Awaitable`<`void`\>

#### Defined in

[src/handlers/EventHandlerOptions.ts:30](https://github.com/s809/noisecord/blob/9cb1c4e/src/handlers/EventHandlerOptions.ts#L30)

___

### onSlowCommand

 **onSlowCommand**: (`this`: [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\>, `req`: `TCommandRequest`) => `Awaitable`<`void`\>

#### Type declaration

(`this`, `req`): `Awaitable`<`void`\>

Called if the command did not complete before a specified delay (default is 1000ms).

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\> |
| `req` | `TCommandRequest` |

##### Returns

`Awaitable`<`void`\>

#### Defined in

[src/handlers/EventHandlerOptions.ts:15](https://github.com/s809/noisecord/blob/9cb1c4e/src/handlers/EventHandlerOptions.ts#L15)

___

### onSuccess

 **onSuccess**: (`this`: [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\>, `req`: `TCommandRequest`) => `Awaitable`<`void`\>

#### Type declaration

(`this`, `req`): `Awaitable`<`void`\>

Called if the command returned `undefined`.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\> |
| `req` | `TCommandRequest` |

##### Returns

`Awaitable`<`void`\>

#### Defined in

[src/handlers/EventHandlerOptions.ts:20](https://github.com/s809/noisecord/blob/9cb1c4e/src/handlers/EventHandlerOptions.ts#L20)

___

### slowCommandDelayMs

 **slowCommandDelayMs**: `number`

#### Defined in

[src/handlers/EventHandlerOptions.ts:10](https://github.com/s809/noisecord/blob/9cb1c4e/src/handlers/EventHandlerOptions.ts#L10)
