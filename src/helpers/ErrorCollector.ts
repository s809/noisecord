import { Collection } from "discord.js";

class ErrorList {
    readonly messages: string[] = [];
    readonly children = new Collection<string, ErrorList>();
    
    hasErrors(): boolean {
        return !!this.messages.length || this.children.some(child => child.hasErrors());
    }

    toString(indent: number): string {
        const result = this.messages.map(message => `${getIndentString(indent)}- ${message}\n`).join("")
            + groupsToString(this.children, indent);

        return result.trimEnd();
    }
}

const getIndentString = (indent: number) => "    ".repeat(indent);

const groupsToString = (collection: Collection<string, ErrorList>, indent = 0) =>
    collection.filter(child => child.hasErrors())
        .map((child, name) => `${getIndentString(indent)}${name}:\n${child.toString(indent + 1)}\n`).join("");

/** @public */
export class ErrorCollector {
    private errorListMap = new Collection<string, ErrorList>([["(vibe check)", new ErrorList()]]);
    private errorListChain: ErrorList[] = [this.errorListMap.get("(vibe check)")!];
    private errorCount = 0;

    constructor(private errorMessage?: string) { }

    get groupChainLength() {
        return this.errorListChain.length;
    }

    throwIfErrors() {
        if (!this.errorCount) return;

        throw new Error(
            `One of more errors have occured${this.errorMessage ? " " + this.errorMessage : ""}.\n` +
            groupsToString(this.errorListMap) + "\n" +
            `Errors generated: ${this.errorCount}`
        );
    }

    setHeader(level: number, header: string) {
        const children = level
            ? this.errorListChain[level - 1].children
            : this.errorListMap;

        this.errorListChain.splice(
            level, this.errorListChain.length,
            children.get(header) ?? (children.set(header, new ErrorList()), children.get(header)!)
        );
    }

    addError(message: string) {
        this.errorListChain[this.errorListChain.length - 1].messages.push(message);
        this.errorCount++;
    }
}
