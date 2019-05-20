import { describe, it } from "mocha";
import { expect } from "chai";
import { map, value, prop, JsonQuery, JsonQueryResult, JsonParseError, jsonValueType } from "../src";

describe("parse values", () => {
    const parse = map([
        prop("strValue", value("string")),
        prop("numValue", value("number")),
        prop("boolValue", value("boolean")),
    ]);

    it("all properties", () => {
        const query = parse({
            strValue: "some text",
            numValue: 10,
            boolValue: true,
        });

        expect(query).to.be.instanceOf(JsonQuery);
    });

    it("no properties", () => {
        const query = parse({});

        expect(query).to.be.instanceOf(Array);
        expect(query).to.be.eql([
            { message: "property strValue is expected", path: "" },
            { message: "property numValue is expected", path: "" },
            { message: "property boolValue is expected", path: "" },
        ]);
    });

    it("some properties", () => {
        const query = parse({
            strValue: "some text",
            numValue: 10,
        });

        expect(query).to.be.instanceOf(Array);
        expect(query).to.be.eql([
            { message: "property boolValue is expected", path: "" },
        ]);
    });

    it("wrong properties type", () => {
        const query = parse({
            strValue: true,
            numValue: "some text",
            boolValue: 10,
        });

        expect(query).to.be.instanceOf(Array);
        expect(query).to.be.eql([
            { message: "value of type string is expected, but \"true\" is provided", path: "/strValue" },
            { message: "value of type number is expected, but \"some text\" is provided", path: "/numValue" },
            { message: "value of type boolean is expected, but \"10\" is provided", path: "/boolValue" },
        ]);
    });
});
