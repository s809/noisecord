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

[src/interfaces/Command.ts:74](https://github.com/s809/noisecord/blob/37daa76/src/interfaces/Command.ts#L74)

___

### args

 **args**: [`ArgumentData`](Command.ArgumentData.md)

#### Defined in

[src/interfaces/Command.ts:79](https://github.com/s809/noisecord/blob/37daa76/src/interfaces/Command.ts#L79)

___

### conditions

 **conditions**: [`CommandCondition`](CommandCondition.md)[]

#### Defined in

[src/interfaces/Command.ts:75](https://github.com/s809/noisecord/blob/37daa76/src/interfaces/Command.ts#L75)

___

### defaultMemberPermissions

 **defaultMemberPermissions**: `PermissionResolvable`

#### Defined in

[src/interfaces/Command.ts:73](https://github.com/s809/noisecord/blob/37daa76/src/interfaces/Command.ts#L73)

___

### descriptionTranslations

 **descriptionTranslations**: `Partial`<`Record`<``"id"`` \| ``"en-US"`` \| ``"en-GB"`` \| ``"bg"`` \| ``"zh-CN"`` \| ``"zh-TW"`` \| ``"hr"`` \| ``"cs"`` \| ``"da"`` \| ``"nl"`` \| ``"fi"`` \| ``"fr"`` \| ``"de"`` \| ``"el"`` \| ``"hi"`` \| ``"hu"`` \| ``"it"`` \| ``"ja"`` \| ``"ko"`` \| ``"lt"`` \| ``"no"`` \| ``"pl"`` \| ``"pt-BR"`` \| ``"ro"`` \| ``"ru"`` \| ``"es-ES"`` \| ``"sv-SE"`` \| ``"th"`` \| ``"tr"`` \| ``"uk"`` \| ``"vi"``, ``null`` \| `string`\>\>

#### Defined in

[src/interfaces/Command.ts:69](https://github.com/s809/noisecord/blob/37daa76/src/interfaces/Command.ts#L69)

___

### handler

 **handler**: ``null`` \| [`Handler`](../modules/Command.md#handler)<`boolean`, `boolean`, [`HandlerArguments`](../modules/Command.md#handlerarguments)\>

#### Defined in

[src/interfaces/Command.ts:80](https://github.com/s809/noisecord/blob/37daa76/src/interfaces/Command.ts#L80)

___

### interactionCommand

 **interactionCommand**: ``null`` \| [`InteractionCommandData`](Command.InteractionCommandData.md)

#### Defined in

[src/interfaces/Command.ts:77](https://github.com/s809/noisecord/blob/37daa76/src/interfaces/Command.ts#L77)

___

### key

 **key**: `string`

#### Defined in

[src/interfaces/Command.ts:65](https://github.com/s809/noisecord/blob/37daa76/src/interfaces/Command.ts#L65)

___

### nameTranslations

 **nameTranslations**: `Partial`<`Record`<``"id"`` \| ``"en-US"`` \| ``"en-GB"`` \| ``"bg"`` \| ``"zh-CN"`` \| ``"zh-TW"`` \| ``"hr"`` \| ``"cs"`` \| ``"da"`` \| ``"nl"`` \| ``"fi"`` \| ``"fr"`` \| ``"de"`` \| ``"el"`` \| ``"hi"`` \| ``"hu"`` \| ``"it"`` \| ``"ja"`` \| ``"ko"`` \| ``"lt"`` \| ``"no"`` \| ``"pl"`` \| ``"pt-BR"`` \| ``"ro"`` \| ``"ru"`` \| ``"es-ES"`` \| ``"sv-SE"`` \| ``"th"`` \| ``"tr"`` \| ``"uk"`` \| ``"vi"``, ``null`` \| `string`\>\>

#### Defined in

[src/interfaces/Command.ts:68](https://github.com/s809/noisecord/blob/37daa76/src/interfaces/Command.ts#L68)

___

### ownerOnly

 **ownerOnly**: `boolean`

#### Defined in

[src/interfaces/Command.ts:72](https://github.com/s809/noisecord/blob/37daa76/src/interfaces/Command.ts#L72)

___

### path

 **path**: `string`

#### Defined in

[src/interfaces/Command.ts:64](https://github.com/s809/noisecord/blob/37daa76/src/interfaces/Command.ts#L64)

___

### subcommands

 **subcommands**: `Map`<`string`, [`Command`](Command-1.md)\>

#### Defined in

[src/interfaces/Command.ts:82](https://github.com/s809/noisecord/blob/37daa76/src/interfaces/Command.ts#L82)

___

### translationPath

 **translationPath**: `string`

#### Defined in

[src/interfaces/Command.ts:66](https://github.com/s809/noisecord/blob/37daa76/src/interfaces/Command.ts#L66)

___

### usageTranslations

 **usageTranslations**: `Partial`<`Record`<``"id"`` \| ``"en-US"`` \| ``"en-GB"`` \| ``"bg"`` \| ``"zh-CN"`` \| ``"zh-TW"`` \| ``"hr"`` \| ``"cs"`` \| ``"da"`` \| ``"nl"`` \| ``"fi"`` \| ``"fr"`` \| ``"de"`` \| ``"el"`` \| ``"hi"`` \| ``"hu"`` \| ``"it"`` \| ``"ja"`` \| ``"ko"`` \| ``"lt"`` \| ``"no"`` \| ``"pl"`` \| ``"pt-BR"`` \| ``"ro"`` \| ``"ru"`` \| ``"es-ES"`` \| ``"sv-SE"`` \| ``"th"`` \| ``"tr"`` \| ``"uk"`` \| ``"vi"``, ``null`` \| `string`\>\>

#### Defined in

[src/interfaces/Command.ts:70](https://github.com/s809/noisecord/blob/37daa76/src/interfaces/Command.ts#L70)
