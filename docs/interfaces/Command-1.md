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
- [translations](Command-1.md#translations)
- [usageTranslations](Command-1.md#usagetranslations)

## Properties

### allowDMs

 **allowDMs**: `boolean`

#### Defined in

[src/interfaces/Command.ts:90](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L90)

___

### args

 **args**: [`ArgumentData`](Command.ArgumentData.md)

#### Defined in

[src/interfaces/Command.ts:95](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L95)

___

### conditions

 **conditions**: [`CommandCondition`](CommandCondition.md)[]

#### Defined in

[src/interfaces/Command.ts:91](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L91)

___

### defaultMemberPermissions

 **defaultMemberPermissions**: `PermissionResolvable`

#### Defined in

[src/interfaces/Command.ts:89](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L89)

___

### descriptionTranslations

 **descriptionTranslations**: `Partial`<`Record`<``"id"`` \| ``"en-US"`` \| ``"en-GB"`` \| ``"bg"`` \| ``"zh-CN"`` \| ``"zh-TW"`` \| ``"hr"`` \| ``"cs"`` \| ``"da"`` \| ``"nl"`` \| ``"fi"`` \| ``"fr"`` \| ``"de"`` \| ``"el"`` \| ``"hi"`` \| ``"hu"`` \| ``"it"`` \| ``"ja"`` \| ``"ko"`` \| ``"lt"`` \| ``"no"`` \| ``"pl"`` \| ``"pt-BR"`` \| ``"ro"`` \| ``"ru"`` \| ``"es-ES"`` \| ``"sv-SE"`` \| ``"th"`` \| ``"tr"`` \| ``"uk"`` \| ``"vi"``, ``null`` \| `string`\>\>

#### Defined in

[src/interfaces/Command.ts:84](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L84)

___

### handler

 **handler**: ``null`` \| [`Handler`](../modules/Command.md#handler)<`boolean`, `boolean`, [`HandlerArguments`](../modules/Command.md#handlerarguments), `Record`<`string`, `boolean`\>\>

#### Defined in

[src/interfaces/Command.ts:96](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L96)

___

### interactionCommand

 **interactionCommand**: ``null`` \| [`InteractionCommandData`](Command.InteractionCommandData.md)

#### Defined in

[src/interfaces/Command.ts:93](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L93)

___

### key

 **key**: `string`

#### Defined in

[src/interfaces/Command.ts:80](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L80)

___

### nameTranslations

 **nameTranslations**: `Partial`<`Record`<``"id"`` \| ``"en-US"`` \| ``"en-GB"`` \| ``"bg"`` \| ``"zh-CN"`` \| ``"zh-TW"`` \| ``"hr"`` \| ``"cs"`` \| ``"da"`` \| ``"nl"`` \| ``"fi"`` \| ``"fr"`` \| ``"de"`` \| ``"el"`` \| ``"hi"`` \| ``"hu"`` \| ``"it"`` \| ``"ja"`` \| ``"ko"`` \| ``"lt"`` \| ``"no"`` \| ``"pl"`` \| ``"pt-BR"`` \| ``"ro"`` \| ``"ru"`` \| ``"es-ES"`` \| ``"sv-SE"`` \| ``"th"`` \| ``"tr"`` \| ``"uk"`` \| ``"vi"``, ``null`` \| `string`\>\>

#### Defined in

[src/interfaces/Command.ts:83](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L83)

___

### ownerOnly

 **ownerOnly**: `boolean`

#### Defined in

[src/interfaces/Command.ts:88](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L88)

___

### path

 **path**: `string`

#### Defined in

[src/interfaces/Command.ts:79](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L79)

___

### subcommands

 **subcommands**: `Map`<`string`, [`Command`](Command-1.md)\>

#### Defined in

[src/interfaces/Command.ts:98](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L98)

___

### translationPath

 **translationPath**: `string`

#### Defined in

[src/interfaces/Command.ts:81](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L81)

___

### translations

 **translations**: `string`[]

#### Defined in

[src/interfaces/Command.ts:86](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L86)

___

### usageTranslations

 **usageTranslations**: `Partial`<`Record`<``"id"`` \| ``"en-US"`` \| ``"en-GB"`` \| ``"bg"`` \| ``"zh-CN"`` \| ``"zh-TW"`` \| ``"hr"`` \| ``"cs"`` \| ``"da"`` \| ``"nl"`` \| ``"fi"`` \| ``"fr"`` \| ``"de"`` \| ``"el"`` \| ``"hi"`` \| ``"hu"`` \| ``"it"`` \| ``"ja"`` \| ``"ko"`` \| ``"lt"`` \| ``"no"`` \| ``"pl"`` \| ``"pt-BR"`` \| ``"ro"`` \| ``"ru"`` \| ``"es-ES"`` \| ``"sv-SE"`` \| ``"th"`` \| ``"tr"`` \| ``"uk"`` \| ``"vi"``, ``null`` \| `string`\>\>

#### Defined in

[src/interfaces/Command.ts:85](https://github.com/s809/noisecord/blob/master/src/interfaces/Command.ts#L85)
