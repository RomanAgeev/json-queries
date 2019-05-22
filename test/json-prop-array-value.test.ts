import { describe, it } from "mocha";
import { expect } from "chai";
import { json, array, value, prop } from "../src";
import { valueError, arrayError } from "../src/parse";
import { valueToString } from "./test-utils";

describe("json -> prop -> array -> value", () => {

    it("correct array", () => {
        const parser = json([
            prop("testArray", array(value("string"))),
        ]);

        const { query, errors } = parser({
            testArray: ["A", "B", "C"],
        });

        expect(errors).to.be.null;
        expect(query).to.be.not.null;

        expect(query!.findMany("testArray/*")).to.be.eql([
            { value: "A", path: "testArray/0" },
            { value: "B", path: "testArray/1" },
            { value: "C", path: "testArray/2" },
        ]);

        expect(query!.findMany("testArray/0")).to.be.eql([
            { value: "A", path: "testArray/0" },
        ]);

        expect(query!.findMany("testArray/1")).to.be.eql([
            { value: "B", path: "testArray/1" },
        ]);

        expect(query!.findMany("testArray/2")).to.be.eql([
            { value: "C", path: "testArray/2" },
        ]);
    });

    it("empty array", () => {
        const parser = json([
            prop("testArray", array(value("string"))),
        ]);

        const { query, errors } = parser({
            testArray: [],
        });

        expect(errors).to.be.null;
        expect(query).to.be.not.null;

        expect(query!.findMany("testArray/*")).to.be.eql([]);
    });

    it("wrong type array", () => {
        const parser = json([
            prop("testArray", array(value("string"))),
        ]);

        const { query, errors } = parser({
            testArray: [1, 2, 3],
        });

        expect(errors).to.be.eql([
            valueError("string", 1, "/testArray/0"),
            valueError("string", 2, "/testArray/1"),
            valueError("string", 3, "/testArray/2"),
        ]);
        expect(query).to.be.null;
    });

    [
        "text",
        10,
        true,
        {},
        () => true,
        null,
        undefined,
    ]
    .forEach(wrongValue => {
        it(`wrong array : ${valueToString(wrongValue)}`, () => {
            const parser = json([
                prop("testArray", array(value("string"))),
            ]);

            const { query, errors } = parser({
                testArray: value,
            });

            expect(errors).to.be.eql([
                arrayError("/testArray"),
            ]);
            expect(query).to.be.null;
        });
    });
});
