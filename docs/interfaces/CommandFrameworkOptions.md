[@s809/noisecord](../README.md) / [Exports](../modules.md) / CommandFrameworkOptions

# Interface: CommandFrameworkOptions

Options used to initialize [CommandFramework](../classes/CommandFramework.md).

## Table of contents

### Properties

- [commandRegistryOptions](CommandFrameworkOptions.md#commandregistryoptions)
- [commonHandlerOptions](CommandFrameworkOptions.md#commonhandleroptions)
- [interactionCommands](CommandFrameworkOptions.md#interactioncommands)
- [messageCommands](CommandFrameworkOptions.md#messagecommands)
- [translationOptions](CommandFrameworkOptions.md#translationoptions)

## Properties

### commandRegistryOptions

 **commandRegistryOptions**: [`CommandRegistryOptions`](CommandRegistryOptions.md)

#### Defined in

[src/CommandFramework.ts:16](https://github.com/s809/noisecord/blob/d5882c2/src/CommandFramework.ts#L16)

___

### commonHandlerOptions

 `Optional` **commonHandlerOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `slowCommandDelayMs` | `number` |
| `onConditionsUnsatisfied` | (`this`: [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\>, `req`: [`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>, `key`: `string`, `translator`: [`Translator`](../classes/Translator-1.md)) => `Promise`<`void`\> |
| `onInvalidArguments` | (`this`: [`EventHandler`](../classes/EventHandler-1.md)<[`EventHandlerOptions`](EventHandlerOptions.md)<[`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>\>, keyof `ClientEvents`\>, `req`: [`CommandRequest`](../classes/CommandRequest.md)<`boolean`, [`CommandResponse`](../classes/CommandResponse.md)\>, `command`: [`Command`](Command-1.md), `e`: [`ArgumentParseError`](../classes/ArgumentParseError-1.md)<`any`\>, `translator`: [`Translator`](../classes/Translator-1.md)) => `Promise`<`void`\> |

#### Defined in

[src/CommandFramework.ts:20](https://github.com/s809/noisecord/blob/d5882c2/src/CommandFramework.ts#L20)

___

### interactionCommands

 `Optional` **interactionCommands**: [`InteractionHandlerOptions`](InteractionHandlerOptions.md)

#### Defined in

[src/CommandFramework.ts:18](https://github.com/s809/noisecord/blob/d5882c2/src/CommandFramework.ts#L18)

___

### messageCommands

 `Optional` **messageCommands**: [`MessageHandlerOptions`](MessageHandlerOptions.md)

#### Defined in

[src/CommandFramework.ts:19](https://github.com/s809/noisecord/blob/d5882c2/src/CommandFramework.ts#L19)

___

### translationOptions

 **translationOptions**: [`TranslatorManagerOptions`](TranslatorManagerOptions.md)

#### Defined in

[src/CommandFramework.ts:17](https://github.com/s809/noisecord/blob/d5882c2/src/CommandFramework.ts#L17)
