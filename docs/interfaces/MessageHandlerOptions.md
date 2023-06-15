[@s809/noisecord](../README.md) / [Exports](../modules.md) / MessageHandlerOptions

# Interface: MessageHandlerOptions

Options for setting up a message handler.

## Hierarchy

- `Partial`<[`EventHandlerOptions`](EventHandlerOptions.md)\>

  ↳ **`MessageHandlerOptions`**

## Table of contents

### Properties

- [ignoreAllPermissionsFor](MessageHandlerOptions.md#ignoreallpermissionsfor)
- [ignoreOwnerOnlyFor](MessageHandlerOptions.md#ignoreowneronlyfor)
- [onFailure](MessageHandlerOptions.md#onfailure)
- [onInvalidArguments](MessageHandlerOptions.md#oninvalidarguments)
- [onSlowCommand](MessageHandlerOptions.md#onslowcommand)
- [onSuccess](MessageHandlerOptions.md#onsuccess)
- [prefix](MessageHandlerOptions.md#prefix)
- [slowCommandDelayMs](MessageHandlerOptions.md#slowcommanddelayms)

## Properties

### ignoreAllPermissionsFor

 `Optional` **ignoreAllPermissionsFor**: `string` \| `string`[] \| (`msg`: `Message`<`boolean`\>, `command`: [`Command`](Command-1.md)) => `Awaitable`<`boolean`\>

Allows specific users to execute any commands (including owner-only) regardless of any permissions.

#### Defined in

[src/handlers/Message/MessageHandler.ts:49](https://github.com/s809/noisecord/blob/50a8c6b/src/handlers/Message/MessageHandler.ts#L49)

___

### ignoreOwnerOnlyFor

 `Optional` **ignoreOwnerOnlyFor**: `string` \| `string`[] \| (`msg`: `Message`<`boolean`\>, `command`: [`Command`](Command-1.md)) => `Awaitable`<`boolean`\>

Allows specific users to execute owner-only commands.

#### Defined in

[src/handlers/Message/MessageHandler.ts:54](https://github.com/s809/noisecord/blob/50a8c6b/src/handlers/Message/MessageHandler.ts#L54)

___

### onFailure

 `Optional` **onFailure**: (`this`: [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\>, `req`: [`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>, `error`: `Error`) => `Awaitable`<`void`\>

#### Type declaration

(`this`, `req`, `error`): `Awaitable`<`void`\>

Called if the command returned a value other than `undefined` or threw an exception.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\> |
| `req` | [`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\> |
| `error` | `Error` |

##### Returns

`Awaitable`<`void`\>

#### Inherited from

Partial.onFailure

#### Defined in

[src/handlers/EventHandlerOptions.ts:25](https://github.com/s809/noisecord/blob/50a8c6b/src/handlers/EventHandlerOptions.ts#L25)

___

### onInvalidArguments

 `Optional` **onInvalidArguments**: (`this`: [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\>, `req`: [`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>, `command`: [`Command`](Command-1.md), `e`: [`ArgumentParseError`](../classes/ArgumentParseError-1.md)<`any`\>, `translator`: [`Translator`](../classes/Translator-1.md)) => `Awaitable`<`void`\>

#### Type declaration

(`this`, `req`, `command`, `e`, `translator`): `Awaitable`<`void`\>

Called if the command received invalid arguments.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\> |
| `req` | [`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\> |
| `command` | [`Command`](Command-1.md) |
| `e` | [`ArgumentParseError`](../classes/ArgumentParseError-1.md)<`any`\> |
| `translator` | [`Translator`](../classes/Translator-1.md) |

##### Returns

`Awaitable`<`void`\>

#### Inherited from

Partial.onInvalidArguments

#### Defined in

[src/handlers/EventHandlerOptions.ts:30](https://github.com/s809/noisecord/blob/50a8c6b/src/handlers/EventHandlerOptions.ts#L30)

___

### onSlowCommand

 `Optional` **onSlowCommand**: (`this`: [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\>, `req`: [`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>) => `Awaitable`<`void`\>

#### Type declaration

(`this`, `req`): `Awaitable`<`void`\>

Called if the command did not complete before a specified delay (default is 1000ms).

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\> |
| `req` | [`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\> |

##### Returns

`Awaitable`<`void`\>

#### Inherited from

Partial.onSlowCommand

#### Defined in

[src/handlers/EventHandlerOptions.ts:15](https://github.com/s809/noisecord/blob/50a8c6b/src/handlers/EventHandlerOptions.ts#L15)

___

### onSuccess

 `Optional` **onSuccess**: (`this`: [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\>, `req`: [`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>) => `Awaitable`<`void`\>

#### Type declaration

(`this`, `req`): `Awaitable`<`void`\>

Called if the command returned `undefined`.

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\> |
| `req` | [`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\> |

##### Returns

`Awaitable`<`void`\>

#### Inherited from

Partial.onSuccess

#### Defined in

[src/handlers/EventHandlerOptions.ts:20](https://github.com/s809/noisecord/blob/50a8c6b/src/handlers/EventHandlerOptions.ts#L20)

___

### prefix

 **prefix**: `string` \| `Map`<``null`` \| `string`, `string`\> \| (`msg`: `Message`<`boolean`\>) => `Awaitable`<``null`` \| `string`\>

Sets a prefix.

When it's a map:
- Its key must be a guild ID, or `null` for default prefix;
- If `null` key is not present, commands outside specified guilds will be ignored.

#### Defined in

[src/handlers/Message/MessageHandler.ts:44](https://github.com/s809/noisecord/blob/50a8c6b/src/handlers/Message/MessageHandler.ts#L44)

___

### slowCommandDelayMs

 `Optional` **slowCommandDelayMs**: `number`

#### Inherited from

Partial.slowCommandDelayMs

#### Defined in

[src/handlers/EventHandlerOptions.ts:10](https://github.com/s809/noisecord/blob/50a8c6b/src/handlers/EventHandlerOptions.ts#L10)
