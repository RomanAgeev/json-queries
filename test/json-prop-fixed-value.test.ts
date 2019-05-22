import { describe, it } from "mocha";
import { expect } from "chai";
import { json, prop, obj, value } from "../src";
import { propertyError, objectError } from "../src/parse";
import { valueToString } from "./test-utils";

describe("json -> prop -> fixed -> value", () => {
    const parser = json([
        prop("fixed", obj([
            prop("prop1", value("string")),
            prop("prop2", value("string")),
        ])),
    ]);

    it("correct object and values", () => {
        const { query, errors } = parser({
            fixed: {
                prop1: "text 1",
                prop2: "text 2",
            },
        });

        expect(errors).to.be.null;
        expect(query).to.be.not.null;

        expect(query!.findMany("fixed/*")).to.be.eql([
            { value: "text 1", path: "fixed/prop1" },
            { value: "text 2", path: "fixed/prop2" },
        ]);

        expect(query!.findMany("fixed/prop1")).to.be.eql([
            { value: "text 1", path: "fixed/prop1" },
        ]);

        expect(query!.findMany("fixed/prop2")).to.be.eql([
            { value: "text 2", path: "fixed/prop2" },
        ]);
    });

    it("wrong property", () => {
        const { query, errors } = parser({
            fixed: {
                prop1: "text 1",
                wrongProp2: "text 2",
            },
        });

        expect(errors).to.be.eql([
            propertyError("prop2", "/fixed"),
        ]);
        expect(query).to.be.null;
    });

    it("empty object", () => {
        const { query, errors } = parser({
            fixed: {},
        });

        expect(errors).to.be.eql([
            propertyError("prop1", "/fixed"),
            propertyError("prop2", "/fixed"),
        ]);
        expect(query).to.be.null;
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
                fixed: testObj,
            });

            expect(errors).to.be.eql([
                objectError("/fixed"),
            ]);
            expect(query).to.be.null;
        });
    });
});
