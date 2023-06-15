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

[src/handlers/EventHandler.ts:22](https://github.com/s809/noisecord/blob/50a8c6b/src/handlers/EventHandler.ts#L22)

___

### CommonHandlerOptions

 **CommonHandlerOptions**: [`EventHandler`](../classes/EventHandler-1.md)[``"defaultCommonStatusHandlers"``]

#### Defined in

[src/handlers/EventHandler.ts:25](https://github.com/s809/noisecord/blob/50a8c6b/src/handlers/EventHandler.ts#L25)

___

### HandlerOptionsCommandRequest

 **HandlerOptionsCommandRequest**<`T`\>: `T` extends [`EventHandlerOptions`](../interfaces/EventHandlerOptions.md)<infer T\> ? `T` : `never`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/handlers/EventHandler.ts:16](https://github.com/s809/noisecord/blob/50a8c6b/src/handlers/EventHandler.ts#L16)
