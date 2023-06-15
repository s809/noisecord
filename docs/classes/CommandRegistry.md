[@s809/noisecord](../README.md) / [Exports](../modules.md) / CommandRegistry

# Class: CommandRegistry

Contains the data/functions for working with commands.

## Table of contents

### Properties

- [commands](CommandRegistry.md#commands)
- [commandsById](CommandRegistry.md#commandsbyid)
- [commandsByLocale](CommandRegistry.md#commandsbylocale)
- [contextMenuCommands](CommandRegistry.md#contextmenucommands)
- [translatorManager](CommandRegistry.md#translatormanager)

### Methods

- [getCommandTranslationPath](CommandRegistry.md#getcommandtranslationpath)
- [getCommandUsageString](CommandRegistry.md#getcommandusagestring)
- [iterateCommands](CommandRegistry.md#iteratecommands)
- [iterateSubcommands](CommandRegistry.md#iteratesubcommands)
- [resolveCommandByLocalizedPath](CommandRegistry.md#resolvecommandbylocalizedpath)
- [resolveCommandByPath](CommandRegistry.md#resolvecommandbypath)

## Properties

### commands

 `Readonly` **commands**: `Map`<`string`, [`Command`](../interfaces/Command-1.md)\>

#### Defined in

[src/CommandRegistry.ts:25](https://github.com/s809/noisecord/blob/ab0ef27/src/CommandRegistry.ts#L25)

___

### commandsById

 `Readonly` **commandsById**: `Map`<`string`, `Map`<`string`, [`Command`](../interfaces/Command-1.md)\> \| [`ContextMenuCommand`](../interfaces/ContextMenuCommand.md)\>

#### Defined in

[src/CommandRegistry.ts:28](https://github.com/s809/noisecord/blob/ab0ef27/src/CommandRegistry.ts#L28)

___

### commandsByLocale

 `Readonly` **commandsByLocale**: `Map`<``"id"`` \| ``"en-US"`` \| ``"en-GB"`` \| ``"bg"`` \| ``"zh-CN"`` \| ``"zh-TW"`` \| ``"hr"`` \| ``"cs"`` \| ``"da"`` \| ``"nl"`` \| ``"fi"`` \| ``"fr"`` \| ``"de"`` \| ``"el"`` \| ``"hi"`` \| ``"hu"`` \| ``"it"`` \| ``"ja"`` \| ``"ko"`` \| ``"lt"`` \| ``"no"`` \| ``"pl"`` \| ``"pt-BR"`` \| ``"ro"`` \| ``"ru"`` \| ``"es-ES"`` \| ``"sv-SE"`` \| ``"th"`` \| ``"tr"`` \| ``"uk"`` \| ``"vi"``, [`DeeplyNestedMap`](../modules.md#deeplynestedmap)<[`Command`](../interfaces/Command-1.md)\>\>

#### Defined in

[src/CommandRegistry.ts:26](https://github.com/s809/noisecord/blob/ab0ef27/src/CommandRegistry.ts#L26)

___

### contextMenuCommands

 `Readonly` **contextMenuCommands**: [`ContextMenuCommand`](../interfaces/ContextMenuCommand.md)[] = `[]`

#### Defined in

[src/CommandRegistry.ts:27](https://github.com/s809/noisecord/blob/ab0ef27/src/CommandRegistry.ts#L27)

___

### translatorManager

 `Readonly` **translatorManager**: [`TranslatorManager`](TranslatorManager-1.md)

#### Defined in

[src/CommandRegistry.ts:31](https://github.com/s809/noisecord/blob/ab0ef27/src/CommandRegistry.ts#L31)

## Methods

### getCommandTranslationPath

**getCommandTranslationPath**(`path`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`string`

#### Defined in

[src/CommandRegistry.ts:159](https://github.com/s809/noisecord/blob/ab0ef27/src/CommandRegistry.ts#L159)

**getCommandTranslationPath**(`key`, `contextMenu`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `contextMenu` | ``true`` |

#### Returns

`string`

#### Defined in

[src/CommandRegistry.ts:160](https://github.com/s809/noisecord/blob/ab0ef27/src/CommandRegistry.ts#L160)

___

### getCommandUsageString

**getCommandUsageString**(`command`, `prefix`, `translator`): `string`

Returns the given command's usage string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `command` | [`Command`](../interfaces/Command-1.md) | Command to give the usage string to. |
| `prefix` | `string` | Prefix to place in front of command string. |
| `translator` | [`Translator`](Translator-1.md) | Translator to use for localization. |

#### Returns

`string`

Usage string.

#### Defined in

[src/CommandRegistry.ts:216](https://github.com/s809/noisecord/blob/ab0ef27/src/CommandRegistry.ts#L216)

___

### iterateCommands

**iterateCommands**(): `Iterable`<[`Command`](../interfaces/Command-1.md)\>

Recursively iterates commands.

#### Returns

`Iterable`<[`Command`](../interfaces/Command-1.md)\>

#### Defined in

[src/CommandRegistry.ts:231](https://github.com/s809/noisecord/blob/ab0ef27/src/CommandRegistry.ts#L231)

___

### iterateSubcommands

**iterateSubcommands**(`list`): `Iterable`<[`Command`](../interfaces/Command-1.md)\>

Recursively iterates a map with commands.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `list` | `ReadonlyMap`<`string`, [`Command`](../interfaces/Command-1.md)\> | List of commands to iterate. |

#### Returns

`Iterable`<[`Command`](../interfaces/Command-1.md)\>

#### Defined in

[src/CommandRegistry.ts:240](https://github.com/s809/noisecord/blob/ab0ef27/src/CommandRegistry.ts#L240)

___

### resolveCommandByLocalizedPath

**resolveCommandByLocalizedPath**(`path`, `translator`, `allowFallback?`): ``null`` \| [`Command`](../interfaces/Command-1.md)

Resolves command by its localized path.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `path` | `string` \| `string`[] | `undefined` | Path to command. |
| `translator` | [`Translator`](Translator-1.md) | `undefined` | Translator to use for searching. |
| `allowFallback` | `boolean` | `true` | Whether to allow fallback to default locale if the given path is inconsistent/in default locale. |

#### Returns

``null`` \| [`Command`](../interfaces/Command-1.md)

Command, if it was found.

#### Defined in

[src/CommandRegistry.ts:192](https://github.com/s809/noisecord/blob/ab0ef27/src/CommandRegistry.ts#L192)

___

### resolveCommandByPath

**resolveCommandByPath**(`path`, `allowPartialResolve?`): ``null`` \| [`Command`](../interfaces/Command-1.md)

Resolves command by its path.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `path` | `string` \| `string`[] | `undefined` | Path to command. |
| `allowPartialResolve` | `boolean` | `false` | Whether to allow resolving to closest match. |

#### Returns

``null`` \| [`Command`](../interfaces/Command-1.md)

Command, if it was found.

#### Defined in

[src/CommandRegistry.ts:174](https://github.com/s809/noisecord/blob/ab0ef27/src/CommandRegistry.ts#L174)