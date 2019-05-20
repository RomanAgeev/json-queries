import { describe, it } from "mocha";
import { expect } from "chai";
import { isJsonParseErrors, JsonParseError } from "../src/json-parse-error";

describe("this is my first mocha test", () => {
    it("bla bla bla", () => {
        const result = isJsonParseErrors([new JsonParseError("test message", "one/two")]);

        expect(result).to.be.true;
    });
});
