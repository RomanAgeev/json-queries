import { describe, it } from "mocha";
import { expect } from "chai";
import { json, prop, obj, value } from "../src";
import { valueToString } from "./test-utils";
import { objectError } from "../src/parse";

describe("json -> prop -> free -> value", () => {
    const parser = json([
        prop("free", obj([
            prop("*", value("string")),
        ])),
    ]);

    it("correct object and values", () => {
        const { query, errors } = parser({
            free: {
                one: "text 1",
                two: "text 2",
            },
        });

        expect(errors).to.be.null;
        expect(query).to.be.not.null;

        expect(query!.findMany("free/*")).to.be.eql([
            { value: "text 1", path: "free/one" },
            { value: "text 2", path: "free/two" },
        ]);
    });

    it("empty object", () => {
        const { query, errors } = parser({
            free: {},
        });

        expect(errors).to.be.null;
        expect(query).to.be.not.null;

        expect(query!.findMany("free/*")).to.be.eql([]);
    });

    [
        "text",
        10,
        true,
        [],
        () => true,
        null,
        undefined,
    ]
    .forEach(testObj => {
        it(`wrong object : ${valueToString(testObj)}`, () => {
            const { query, errors } = parser({
                free: testObj,
            });

            expect(errors).to.be.eql([
                objectError("/free"),
            ]);
            expect(query).to.be.null;
        });
    });
});
