import { describe, it } from "mocha";
import { expect } from "chai";
import { json, prop, variable } from "../src";
import { variableError } from "../src/parse";
import { valueToString } from "./test-utils";

describe("json -> prop -> envar", () => {
    const parser = json([
        prop("testVariable", variable(name => `${name}_RESOLVED`)),
    ]);

    it("valid variable", () => {
        const { query, errors } = parser({
            testVariable: "${TEST_VAR}",
        });

        expect(errors).to.be.null;
        expect(query).to.be.not.null;

        expect(query!("testVariable")).to.be.eql([
            { value: "TEST_VAR_RESOLVED", path: "testVariable" },
        ]);
    });

    [
        10,
        true,
        {},
        [],
        () => true,
        "",
        null,
        undefined,
        "TEST_VAR",
        "{TEST_VAR}",
        "${TEST_VAR}_",
        "_${TEST_VAR}",
    ]
    .forEach(testValue => {
        it(`wrong variable : ${valueToString(testValue)}`, () => {
            const { query, errors } = parser({
                testVariable: testValue,
            });

            expect(errors).to.be.eql([
                variableError(testValue, "/testVariable"),
            ]);
            expect(query).to.be.null;
        });
    });
});
