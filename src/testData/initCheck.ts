import { expect } from "chai";
import { Awaitable } from "discord.js";

export function testInitCheck<T extends Record<Props[number], any>, Props extends (keyof T)[]>(
    creator: () => T,
    requiredProps: Props,
    init: (instance: T) => Awaitable<any>
) {
    describe("init() check", () => {
        let instance: T;

        beforeEach(async () => {
            instance = creator();
        });

        describe("Not called", () => {
            for (const prop of requiredProps) {
                it(`#${prop as string}`, () => {
                    expect(() => instance[prop]).throw("init()");
                });
            }
        });

        describe("Called", () => {
            beforeEach(async () => {
                await init(instance);
            });

            for (const prop of requiredProps) {
                it(`#${prop as string}`, () => {
                    expect(instance[prop]).exist;
                });
            }
        });
    });
}
