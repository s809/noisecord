[@s809/noisecord](../README.md) / [Exports](../modules.md) / CommandDefinition

# Namespace: CommandDefinition

## Table of contents

### Interfaces

- [ArgumentToTypeMap](../interfaces/CommandDefinition.ArgumentToTypeMap.md)

### Type Aliases

- [Argument](CommandDefinition.md#argument)
- [HandlerArguments](CommandDefinition.md#handlerarguments)

## Type Aliases

### Argument

 **Argument**: `Simplify`<[`DistributiveOmit`](../modules.md#distributiveomit)<`IterableElement`<`NonNullable`<`ApplicationCommandSubCommandData`[``"options"``]\>\>, ``"name"`` \| ``"nameLocalizations"`` \| ``"description"`` \| ``"descriptionLocalizations"`` \| ``"choices"``\> & { `choices?`: readonly { `key`: `string` ; `value`: `string` \| `number`  }[] ; `isExtras?`: `boolean` ; `key`: `string`  }\>

#### Defined in

[src/interfaces/Command.ts:32](https://github.com/s809/noisecord/blob/ab0ef27/src/interfaces/Command.ts#L32)

___

### HandlerArguments

 **HandlerArguments**<`Args`\>: { [Item in Args[number] as Item["key"]]: Item["type"] extends keyof ArgumentToTypeMap<Item["isExtras"]\> ? Item["choices"] extends readonly any[] ? Item["choices"][number]["value"] : ArgumentToTypeMap<Item["isExtras"]\>[Item["type"]] \| (Item["required"] extends false ? undefined : never) : never }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Args` | extends readonly [`Argument`](CommandDefinition.md#argument)[] |

#### Defined in

[src/interfaces/Command.ts:42](https://github.com/s809/noisecord/blob/ab0ef27/src/interfaces/Command.ts#L42)
