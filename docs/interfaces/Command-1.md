[@s809/noisecord](../README.md) / [Exports](../modules.md) / Command

# Interface: Command

## Table of contents

### Properties

- [allowDMs](Command-1.md#allowdms)
- [args](Command-1.md#args)
- [conditions](Command-1.md#conditions)
- [defaultMemberPermissions](Command-1.md#defaultmemberpermissions)
- [descriptionTranslations](Command-1.md#descriptiontranslations)
- [handler](Command-1.md#handler)
- [interactionCommand](Command-1.md#interactioncommand)
- [key](Command-1.md#key)
- [nameTranslations](Command-1.md#nametranslations)
- [ownerOnly](Command-1.md#owneronly)
- [path](Command-1.md#path)
- [subcommands](Command-1.md#subcommands)
- [translationPath](Command-1.md#translationpath)
- [usageTranslations](Command-1.md#usagetranslations)

## Properties

### allowDMs

 **allowDMs**: `boolean`

#### Defined in

[src/interfaces/Command.ts:75](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L75)

___

### args

 **args**: [`ArgumentData`](Command.ArgumentData.md)

#### Defined in

[src/interfaces/Command.ts:80](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L80)

___

### conditions

 **conditions**: [`CommandCondition`](CommandCondition.md)[]

#### Defined in

[src/interfaces/Command.ts:76](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L76)

___

### defaultMemberPermissions

 **defaultMemberPermissions**: `PermissionResolvable`

#### Defined in

[src/interfaces/Command.ts:74](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L74)

___

### descriptionTranslations

 **descriptionTranslations**: `Partial`<`Record`<``"id"`` \| ``"en-US"`` \| ``"en-GB"`` \| ``"bg"`` \| ``"zh-CN"`` \| ``"zh-TW"`` \| ``"hr"`` \| ``"cs"`` \| ``"da"`` \| ``"nl"`` \| ``"fi"`` \| ``"fr"`` \| ``"de"`` \| ``"el"`` \| ``"hi"`` \| ``"hu"`` \| ``"it"`` \| ``"ja"`` \| ``"ko"`` \| ``"lt"`` \| ``"no"`` \| ``"pl"`` \| ``"pt-BR"`` \| ``"ro"`` \| ``"ru"`` \| ``"es-ES"`` \| ``"sv-SE"`` \| ``"th"`` \| ``"tr"`` \| ``"uk"`` \| ``"vi"``, ``null`` \| `string`\>\>

#### Defined in

[src/interfaces/Command.ts:70](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L70)

___

### handler

 **handler**: ``null`` \| [`Handler`](../modules/Command.md#handler)<`boolean`, `boolean`, [`HandlerArguments`](../modules/Command.md#handlerarguments)\>

#### Defined in

[src/interfaces/Command.ts:81](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L81)

___

### interactionCommand

 **interactionCommand**: ``null`` \| [`InteractionCommandData`](Command.InteractionCommandData.md)

#### Defined in

[src/interfaces/Command.ts:78](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L78)

___

### key

 **key**: `string`

#### Defined in

[src/interfaces/Command.ts:66](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L66)

___

### nameTranslations

 **nameTranslations**: `Partial`<`Record`<``"id"`` \| ``"en-US"`` \| ``"en-GB"`` \| ``"bg"`` \| ``"zh-CN"`` \| ``"zh-TW"`` \| ``"hr"`` \| ``"cs"`` \| ``"da"`` \| ``"nl"`` \| ``"fi"`` \| ``"fr"`` \| ``"de"`` \| ``"el"`` \| ``"hi"`` \| ``"hu"`` \| ``"it"`` \| ``"ja"`` \| ``"ko"`` \| ``"lt"`` \| ``"no"`` \| ``"pl"`` \| ``"pt-BR"`` \| ``"ro"`` \| ``"ru"`` \| ``"es-ES"`` \| ``"sv-SE"`` \| ``"th"`` \| ``"tr"`` \| ``"uk"`` \| ``"vi"``, ``null`` \| `string`\>\>

#### Defined in

[src/interfaces/Command.ts:69](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L69)

___

### ownerOnly

 **ownerOnly**: `boolean`

#### Defined in

[src/interfaces/Command.ts:73](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L73)

___

### path

 **path**: `string`

#### Defined in

[src/interfaces/Command.ts:65](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L65)

___

### subcommands

 **subcommands**: `Map`<`string`, [`Command`](Command-1.md)\>

#### Defined in

[src/interfaces/Command.ts:83](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L83)

___

### translationPath

 **translationPath**: `string`

#### Defined in

[src/interfaces/Command.ts:67](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L67)

___

### usageTranslations

 **usageTranslations**: `Partial`<`Record`<``"id"`` \| ``"en-US"`` \| ``"en-GB"`` \| ``"bg"`` \| ``"zh-CN"`` \| ``"zh-TW"`` \| ``"hr"`` \| ``"cs"`` \| ``"da"`` \| ``"nl"`` \| ``"fi"`` \| ``"fr"`` \| ``"de"`` \| ``"el"`` \| ``"hi"`` \| ``"hu"`` \| ``"it"`` \| ``"ja"`` \| ``"ko"`` \| ``"lt"`` \| ``"no"`` \| ``"pl"`` \| ``"pt-BR"`` \| ``"ro"`` \| ``"ru"`` \| ``"es-ES"`` \| ``"sv-SE"`` \| ``"th"`` \| ``"tr"`` \| ``"uk"`` \| ``"vi"``, ``null`` \| `string`\>\>

#### Defined in

[src/interfaces/Command.ts:71](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L71)
