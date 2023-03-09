export class ArgumentParseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class CommandResultError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}
