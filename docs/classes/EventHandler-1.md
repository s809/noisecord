[@s809/noisecord](../README.md) / [Exports](../modules.md) / EventHandler

# Class: EventHandler<Options, EventName\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `Options` | extends [`EventHandlerOptions`](../interfaces/EventHandlerOptions.md) = [`EventHandlerOptions`](../interfaces/EventHandlerOptions.md) |
| `EventName` | extends keyof `ClientEvents` = keyof `ClientEvents` |

## Table of contents

### Properties

- [defaultCommonStatusHandlers](EventHandler-1.md#defaultcommonstatushandlers)
- [defaultStatusHandlers](EventHandler-1.md#defaultstatushandlers)

## Properties

### defaultCommonStatusHandlers

 `Readonly` **defaultCommonStatusHandlers**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `slowCommandDelayMs` | `number` |
| `onInvalidArguments` | (`this`: [`EventHandler`](EventHandler-1.md)<[`EventHandlerOptions`](../interfaces/EventHandlerOptions.md)<[`CommandRequest`](CommandRequest.md)<`boolean`, [`CommandResponse`](CommandResponse.md)\>\>, keyof `ClientEvents`\>, `req`: [`HandlerOptionsCommandRequest`](../modules/EventHandler.md#handleroptionscommandrequest)<`Options`\>, `command`: [`Command`](../interfaces/Command-1.md), `e`: [`ArgumentParseError`](ArgumentParseError-1.md)<`any`\>, `translator`: [`Translator`](Translator-1.md)) => `Promise`<`void`\> |

#### Defined in

[src/handlers/EventHandler.ts:35](https://github.com/s809/noisecord/blob/9cb1c4e/src/handlers/EventHandler.ts#L35)

___

### defaultStatusHandlers

 `Readonly` **defaultStatusHandlers**: [`CleanHandlerOptions`](../modules/EventHandler.md#cleanhandleroptions)<`Options`\>

#### Defined in

[src/handlers/EventHandler.ts:34](https://github.com/s809/noisecord/blob/9cb1c4e/src/handlers/EventHandler.ts#L34)
