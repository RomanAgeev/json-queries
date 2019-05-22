import { describe, it } from "mocha";
import { expect } from "chai";
import { json, prop, value } from "../src";
import { propertyError, valueError, objectError } from "../src/parse";

describe("parse values", () => {
    const parser = json([
        prop("strValue", value("string")),
        prop("numValue", value("number")),
        prop("boolValue", value("boolean")),
    ]);

    it("all properties", () => {
        const { query, errors } = parser({
            strValue: "some text",
            numValue: 10,
            boolValue: true,
        });

        expect(errors).to.be.null;
        expect(query).to.be.not.null;

        expect(query!.findMany("strValue")).to.be.eql([
            { value: "some text", path: "strValue" },
        ]);

        expect(query!.findMany("numValue")).to.be.eql([
            { value: 10, path: "numValue" },
        ]);

        expect(query!.findMany("boolValue")).to.be.eql([
            { value: true, path: "boolValue" },
        ]);

        expect(query!.findMany("*")).to.be.eql([
            { value: "some text", path: "strValue" },
            { value: 10, path: "numValue" },
            { value: true, path: "boolValue" },
        ]);
    });

    it("no properties", () => {
        const { query, errors } = parser({});

        expect(errors).to.be.eql([
            propertyError("strValue", ""),
            propertyError("numValue", ""),
            propertyError("boolValue", ""),
        ]);
        expect(query).to.be.null;
    });

    it("some properties", () => {
        const { query, errors } = parser({
            strValue: "some text",
            numValue: 10,
        });

        expect(errors).to.be.eql([
            propertyError("boolValue", ""),
        ]);
        expect(query).to.be.null;
    });

    it("wrong properties type", () => {
        const { query, errors } = parser({
            strValue: true,
            numValue: "some text",
            boolValue: 10,
        });

        expect(errors).to.be.eql([
            valueError("string", true, "/strValue"),
            valueError("number", "some text", "/numValue"),
            valueError("boolean", 10, "/boolValue"),
        ]);
        expect(query).to.be.null;
    });

    it("null / undefined property", () => {
        const { query, errors } = parser({
            strValue: null,
            numValue: undefined,
            boolValue: true,
        });

        expect(errors).to.be.eql([
            valueError("string", null, "/strValue"),
            valueError("number", undefined, "/numValue"),
        ]);
        expect(query).to.be.null;
    });

    [
        [null, "null"],
        [undefined, "undefined"],
    ]
    .forEach(([obj, name]) => {
        it(`${name} obj`, () => {
            const { query, errors } = parser(obj);

            expect(errors).to.be.eql([
                objectError(""),
            ]);
            expect(query).to.be.null;
        });
    });
});
