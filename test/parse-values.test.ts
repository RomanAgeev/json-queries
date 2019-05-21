import { describe, it } from "mocha";
import { expect } from "chai";
import { json, prop, value } from "../src";

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
    });

    it("no properties", () => {
        const { query, errors } = parser({});

        expect(errors).to.be.eql([
            { message: "property strValue is expected", path: "" },
            { message: "property numValue is expected", path: "" },
            { message: "property boolValue is expected", path: "" },
        ]);
        expect(query).to.be.null;
    });

    it("some properties", () => {
        const { query, errors } = parser({
            strValue: "some text",
            numValue: 10,
        });

        expect(errors).to.be.eql([
            { message: "property boolValue is expected", path: "" },
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
            { message: "value of type string is expected, but \"true\" is provided", path: "/strValue" },
            { message: "value of type number is expected, but \"some text\" is provided", path: "/numValue" },
            { message: "value of type boolean is expected, but \"10\" is provided", path: "/boolValue" },
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
            { message: "property strValue is expected", path: "" },
            { message: "property numValue is expected", path: "" },
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
                { message: "object is expected", path: "" },
            ]);
            expect(query).to.be.null;
        });
    });
});
