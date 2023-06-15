[@s809/noisecord](../README.md) / [Exports](../modules.md) / ArgumentParseError

# Namespace: ArgumentParseError

## Table of contents

### Interfaces

- [SingleCauseMap](../interfaces/ArgumentParseError.SingleCauseMap.md)

### Type Aliases

- [CauseMap](ArgumentParseError.md#causemap)

## Type Aliases

### CauseMap

 **CauseMap**: [`SingleCauseMap`](../interfaces/ArgumentParseError.SingleCauseMap.md) & `Record`<keyof [`SingleCauseMap`](../interfaces/ArgumentParseError.SingleCauseMap.md), { `argKey`: `string` ; `argValue`: `string`  }\> & { `too_few_arguments`: { `argCount`: `number` ; `minArgs`: `number`  } ; `too_many_arguments`: { `argCount`: `number` ; `maxArgs`: `number`  }  }

#### Defined in

[src/handlers/errors/ArgumentParseError.ts:28](https://github.com/s809/noisecord/blob/6d7ed8b/src/handlers/errors/ArgumentParseError.ts#L28)
