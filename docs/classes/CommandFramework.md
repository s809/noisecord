[@s809/noisecord](../README.md) / [Exports](../modules.md) / CommandFramework

# Class: CommandFramework

Entry point for using a command framework.

## Table of contents

### Constructors

- [constructor](CommandFramework.md#constructor)

### Properties

- [translationChecker](CommandFramework.md#translationchecker)

### Accessors

- [commandRegistry](CommandFramework.md#commandregistry)
- [commands](CommandFramework.md#commands)
- [translatorManager](CommandFramework.md#translatormanager)

### Methods

- [init](CommandFramework.md#init)
- [create](CommandFramework.md#create)

## Constructors

### constructor

**new CommandFramework**(`client`, `options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | `Client`<`boolean`\> |
| `options` | [`CommandFrameworkOptions`](../interfaces/CommandFrameworkOptions.md) |

#### Defined in

[src/CommandFramework.ts:51](https://github.com/s809/noisecord/blob/6d7ed8b/src/CommandFramework.ts#L51)

## Properties

### translationChecker

 `Readonly` **translationChecker**: [`TranslationChecker`](TranslationChecker-1.md)

#### Defined in

[src/CommandFramework.ts:46](https://github.com/s809/noisecord/blob/6d7ed8b/src/CommandFramework.ts#L46)

## Accessors

### commandRegistry

`get` **commandRegistry**(): [`CommandRegistry`](CommandRegistry.md)

**`See`**

CommandRegistry

#### Returns

[`CommandRegistry`](CommandRegistry.md)

#### Defined in

[src/CommandFramework.ts:36](https://github.com/s809/noisecord/blob/6d7ed8b/src/CommandFramework.ts#L36)

___

### commands

`get` **commands**(): `Map`<`string`, [`Command`](../interfaces/Command-1.md)\>

Tree of commands.

#### Returns

`Map`<`string`, [`Command`](../interfaces/Command-1.md)\>

#### Defined in

[src/CommandFramework.ts:31](https://github.com/s809/noisecord/blob/6d7ed8b/src/CommandFramework.ts#L31)

___

### translatorManager

`get` **translatorManager**(): [`TranslatorManager`](TranslatorManager-1.md)

**`See`**

TranslatorManager

#### Returns

[`TranslatorManager`](TranslatorManager-1.md)

#### Defined in

[src/CommandFramework.ts:42](https://github.com/s809/noisecord/blob/6d7ed8b/src/CommandFramework.ts#L42)

## Methods

### init

**init**(): `Promise`<[`CommandFramework`](CommandFramework.md)\>

Initializes everything related to the framework.

#### Returns

`Promise`<[`CommandFramework`](CommandFramework.md)\>

#### Defined in

[src/CommandFramework.ts:67](https://github.com/s809/noisecord/blob/6d7ed8b/src/CommandFramework.ts#L67)

___

### create

`Static` **create**(`client`, `options`): `Promise`<[`CommandFramework`](CommandFramework.md)\>

Creates a new instance of the [CommandFramework](CommandFramework.md) class.
This is a shortcut for constructing and initializing an instance if your instance will reside in the main file.

**`Remarks`**

Translation checking is not possible using the returned instance, as it uses a window between construction and initialization of an instance.
See constructor and [init()](CommandFramework.md#init) 
for the case when construction and initialization need to be split.

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | `Client`<`boolean`\> |
| `options` | [`CommandFrameworkOptions`](../interfaces/CommandFrameworkOptions.md) |

#### Returns

`Promise`<[`CommandFramework`](CommandFramework.md)\>

#### Defined in

[src/CommandFramework.ts:62](https://github.com/s809/noisecord/blob/6d7ed8b/src/CommandFramework.ts#L62)
