import { describe, it } from "mocha";
import { expect } from "chai";
import { json, prop, value } from "../src";
import { valueError, propertyError, objectError } from "../src/parse";
import { valueToString } from "./test-utils";

describe("json -> prop -> value", () => {

    it("all properties and values", () => {
        const parser = json([
            prop("strValue", value("string")),
            prop("numValue", value("number")),
            prop("boolValue", value("boolean")),
        ]);

        const { query, errors } = parser({
            strValue: "some text",
            numValue: 10,
            boolValue: true,
        });

        expect(errors).to.be.null;
        expect(query).to.be.not.null;

        expect(query!("strValue")).to.be.eql([
            { value: "some text", path: "strValue" },
        ]);

        expect(query!("numValue")).to.be.eql([
            { value: 10, path: "numValue" },
        ]);

        expect(query!("boolValue")).to.be.eql([
            { value: true, path: "boolValue" },
        ]);

        expect(query!("*")).to.be.eql([
            { value: "some text", path: "strValue" },
            { value: 10, path: "numValue" },
            { value: true, path: "boolValue" },
        ]);
    });

    [
        {},
        { wrongValue: "some text" },
    ]
    .forEach(obj => {
        it(`wrong property : ${valueToString(obj)}`, () => {
            const parser = json([
                prop("value", value("string")),
            ]);

            const { query, errors } = parser({
                wrongValue: "some text",
            });

            expect(errors).to.be.eql([
                propertyError("value", ""),
            ]);
            expect(query).to.be.null;
        });
    });

    [
        true,
        10,
        {},
        [],
        () => true,
    ]
    .forEach(testValue => {
        it(`wrong value : ${valueToString(testValue)}`, () => {
            const parser = json([
                prop("value", value("string")),
            ]);

            const { query, errors } = parser({
                value: testValue,
            });

            expect(errors).to.be.eql([
                valueError("string", testValue, "/value"),
            ]);
            expect(query).to.be.null;
        });
    });

    [
        undefined,
        null,
    ]
    .forEach(testValue => {
        it(`no value: ${valueToString(testValue)}`, () => {
            const parser = json([
                prop("value", value("string")),
            ]);

            const { query, errors } = parser({
                value: testValue,
            });

            expect(errors).to.be.null;
            expect(query).to.be.not.null;

            expect(query!("value")).to.be.eql([
                { value: testValue, path: "value" },
            ]);
        });
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
    .forEach(testJson => {
        it(`wrong json : ${valueToString(testJson)}`, () => {
            const parser = json([
                prop("value", value("string")),
            ]);

            const { query, errors } = parser(testJson);

            expect(errors).to.be.eql([
                objectError(""),
            ]);
            expect(query).to.be.null;
        });
    });
});
