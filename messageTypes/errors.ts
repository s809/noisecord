export class InteractionReplyError extends Error {
    constructor() {
        super("Interaction reply was deleted.");
        this.name = this.constructor.name;
    }
}

