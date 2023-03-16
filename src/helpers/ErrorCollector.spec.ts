import { expect } from "chai";
import { ErrorCollector } from "./ErrorCollector.js";

describe(ErrorCollector.name, () => {
    let errorCollector: ErrorCollector;

    beforeEach(() => {
        errorCollector = new ErrorCollector();
    });

    describe("No errors", () => { 
        it("Empty collector", () => {
            errorCollector.throwIfErrors();
        });

        it("Empty levels", () => {
            errorCollector.setHeader(0, "Level 1");
            errorCollector.setHeader(1, "Level 1-1");

            errorCollector.throwIfErrors();
        });
    });

    it("Error tree", () => { 
        errorCollector.setHeader(0, "Level 1");
        errorCollector.addError("Error 1-1");
        errorCollector.addError("Error 1-2");
        errorCollector.setHeader(1, "Level 2");
        errorCollector.addError("Error 2-1");

        expect(() => errorCollector.throwIfErrors()).throw(`
One of more errors have occured.
Level 1:
    - Error 1-1
    - Error 1-2
    Level 2:
        - Error 2-1

Errors generated: 3
`.trim());
    });
    
    it("Error tree after switching levels", () => {
        errorCollector.setHeader(0, "Level 1");
        errorCollector.addError("Error 1-1");
        errorCollector.addError("Error 1-2");
        errorCollector.setHeader(1, "Level 1-1");
        errorCollector.addError("Error 1-1-1");

        errorCollector.setHeader(0, "Level 2");
        errorCollector.addError("Error 2-1");
        errorCollector.setHeader(1, "Level 2-1");
        errorCollector.addError("Error 2-1-1");

        errorCollector.setHeader(0, "Level 1");
        errorCollector.addError("Error 1-3");
        errorCollector.setHeader(1, "Level 1-1");
        errorCollector.addError("Error 1-1-2");

        expect(() => errorCollector.throwIfErrors()).throw(`
One of more errors have occured.
Level 1:
    - Error 1-1
    - Error 1-2
    - Error 1-3
    Level 1-1:
        - Error 1-1-1
        - Error 1-1-2
Level 2:
    - Error 2-1
    Level 2-1:
        - Error 2-1-1

Errors generated: 7
`.trim());
    });

    it("Filter away empty levels", () => {
        errorCollector.setHeader(0, "Level 1");
        errorCollector.addError("Error 1-1");
        errorCollector.addError("Error 1-2");
        errorCollector.setHeader(1, "Level 1-1");
        expect(() => errorCollector.throwIfErrors()).throw(`
One of more errors have occured.
Level 1:
    - Error 1-1
    - Error 1-2

Errors generated: 2
`.trim());
    });

    it("Custom suffix", () => {
        errorCollector = new ErrorCollector("while doing nothing");
        errorCollector.setHeader(0, "Level 1");
        errorCollector.addError("Error 1-1");
        expect(() => errorCollector.throwIfErrors()).throw(`
One of more errors have occured while doing nothing.
Level 1:
    - Error 1-1

Errors generated: 1
`.trim());
    });
});
