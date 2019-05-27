import { describe, it } from "mocha";
import { expect } from "chai";
import { json, prop, value } from "../src";
import { valueError, JsonValueType } from "../src/parse";
import { valueToString } from "./test-utils";

describe("json -> prop -> variable", () => {
    [
        "${TEST_VAR}",
        "${TEST_VAR-default}",
    ]
    .forEach(variable => {
        it(`string variable resolved : ${variable}`, () => {
            const parser = json([
                prop("test", value("string", () => "RESOLVED")),
            ]);

            const { query, errors } = parser({
                test: variable,
            });

            expect(errors).to.be.null;
            expect(query).to.be.not.null;

            expect(query!("test")).to.be.eql([
                { value: "RESOLVED", path: "test" },
            ]);
        });
    });

    [
        "${TEST_VAR}",
        "${TEST_VAR-default}",
        "${TEST_VAR-10}",
    ]
    .forEach(variable => {
        it(`number variable resolved : ${variable}`, () => {
            const parser = json([
                prop("test", value("number", () => 5)),
            ]);

            const { query, errors } = parser({
                test: variable,
            });

            expect(errors).to.be.null;
            expect(query).to.be.not.null;

            expect(query!("test")).to.be.eql([
                { value: 5, path: "test" },
            ]);
        });
    });

    [
        "${TEST_VAR}",
        "${TEST_VAR-default}",
        "${TEST_VAR-false}",
    ]
    .forEach(variable => {
        it(`boolean variable resolved : ${variable}`, () => {
            const parser = json([
                prop("test", value("boolean", () => true)),
            ]);

            const { query, errors } = parser({
                test: variable,
            });

            expect(errors).to.be.null;
            expect(query).to.be.not.null;

            expect(query!("test")).to.be.eql([
                { value: true, path: "test" },
            ]);
        });
    });

    [
        ["string", "${TEST_VAR}", undefined],
        ["string", "${TEST_VAR-default}", "default"],
        ["number", "${TEST_VAR-10}", 10],
        ["boolean", "${TEST_VAR-true}", true],
    ]
    .forEach(([valueType, variable, expectedValue]) => {
        it(`variable not resolved : ${valueType} - ${variable}`, () => {
            const parser = json([
                prop("test", value(valueType as JsonValueType, () => null)),
            ]);

            const { query, errors } = parser({
                test: variable,
            });

            expect(errors).to.be.null;
            expect(query).to.be.not.null;

            expect(query!("test")).to.be.eql([
                { value: expectedValue, path: "test" },
            ]);
        });
    });

    [
        "",
        "TEST_VAR",
        "{TEST_VAR}",
        "${TEST_VAR}_",
        "_${TEST_VAR}",
        "${TEST_VAR-}",
    ]
    .forEach(testValue => {
        it(`wrong variable format: ${valueToString(testValue)}`, () => {
            const parser = json([
                prop("testVariable", value("string", () => null)),
            ]);

            const { query, errors } = parser({
                testVariable: testValue,
            });

            expect(errors).to.be.null;
            expect(query).to.be.not.null;

            expect(query!("testVariable")).to.be.eql([
                { value: testValue, path: "testVariable" },
            ]);
        });
    });
});
