/** @public */
export class ArgumentParseError<TReason extends keyof ArgumentParseError.CauseMap = any> extends Error {
    private _isSingle: boolean;
    
    /** @internal */
    constructor(
        override readonly message: TReason,
        isSingle: TReason extends keyof ArgumentParseError.SingleCauseMap ? true : false,
        override readonly cause: ArgumentParseError.CauseMap[TReason]
    ) {
        super(message, { cause });
        this.name = this.constructor.name;
        this._isSingle = isSingle;
    }

    isSingle(): this is ArgumentParseError<Extract<TReason, keyof ArgumentParseError.SingleCauseMap>> {
        return this._isSingle;
    }

    hasReason<T extends TReason>(reason: T): this is ArgumentParseError<T> {
        return this.message === reason;
    }
}

/** @public */
export namespace ArgumentParseError {
    /** @public */
    export type CauseMap = SingleCauseMap & Record<keyof SingleCauseMap, {
        argKey: string;
        argValue: string;
    }> & {
        too_few_arguments: {
            argCount: number;
            minArgs: number;
        },
        too_many_arguments: {
            argCount: number;
            maxArgs: number;
        }
    };

    /** @public */
    export interface SingleCauseMap {
        invalid_numeric: {},
        value_not_allowed: {
            allowedValues: string,
            allowedValuesItems: string[]
        },
        value_too_small: {
            minValue: number
        },
        value_too_large: {
            maxValue: number
        },
        value_too_short: {
            minLength: number
        },
        value_too_long: {
            maxLength: number
        },
        invalid_channel: {},
        channel_constraints_not_met: {},
        invalid_user: {},
        invalid_role: {},
        unsupported_argument_type: {
            type: string
        }
    };
}
