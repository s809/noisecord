[@s809/noisecord](../README.md) / [Exports](../modules.md) / EventHandler

# Namespace: EventHandler

## Table of contents

### Type Aliases

- [CleanHandlerOptions](EventHandler.md#cleanhandleroptions)
- [CommonHandlerOptions](EventHandler.md#commonhandleroptions)
- [HandlerOptionsCommandRequest](EventHandler.md#handleroptionscommandrequest)

## Type Aliases

### CleanHandlerOptions

 **CleanHandlerOptions**<`T`\>: [`EventHandlerOptions`](../interfaces/EventHandlerOptions.md)<[`HandlerOptionsCommandRequest`](EventHandler.md#handleroptionscommandrequest)<`T`\>\>

Applies T from any inherited/modified `*Options` to a clean [EventHandlerOptions](../interfaces/EventHandlerOptions.md) type.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/handlers/EventHandler.ts:24](https://github.com/s809/noisecord/blob/master/src/handlers/EventHandler.ts#L24)

___

### CommonHandlerOptions

 **CommonHandlerOptions**: [`EventHandler`](../classes/EventHandler-1.md)[``"defaultCommonStatusHandlers"``]

#### Defined in

[src/handlers/EventHandler.ts:27](https://github.com/s809/noisecord/blob/master/src/handlers/EventHandler.ts#L27)

___

### HandlerOptionsCommandRequest

 **HandlerOptionsCommandRequest**<`T`\>: `T` extends [`EventHandlerOptions`](../interfaces/EventHandlerOptions.md)<infer T\> ? `T` : `never`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/handlers/EventHandler.ts:18](https://github.com/s809/noisecord/blob/master/src/handlers/EventHandler.ts#L18)
