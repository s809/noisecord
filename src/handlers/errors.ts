/** @public */
export class ArgumentParseError extends Error {
    /** @internal */
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

/** @public */
export class CommandResultError extends Error {
    /** @internal */
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}
