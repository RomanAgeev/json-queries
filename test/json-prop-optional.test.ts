import { describe, it } from "mocha";
import { expect } from "chai";
import { json, propOptional, value, prop, obj, array } from "../src";
import { propertyError } from "../src/parse";

describe("json -> prop (optional)", () => {
    const parser = json([
        propOptional("first", value("string")),
        prop("second", obj([
            propOptional("third", array(value("number"))),
        ])),
    ]);

    it("+first, +second, +third", () => {
        const { query, errors } = parser({
            first: "test",
            second: {
                third: [1, 2, 3],
            },
        });

        expect(errors).to.be.null;
        expect(query!("first")).to.eql([
            { value: "test", path: "first" },
        ]);
        expect(query!("second/third")).to.eql([
            { value: [1, 2, 3], path: "second/third" },
        ]);
    });

    it("-first, +second, +third", () => {
        const { query, errors } = parser({
            second: {
                third: [1, 2, 3],
            },
        });

        expect(errors).to.be.null;
        expect(query!("first")).to.eql([]);
        expect(query!("second/third")).to.eql([
            { value: [1, 2, 3], path: "second/third" },
        ]);
    });

    it("-first, +second, -third", () => {
        const { query, errors } = parser({
            second: {},
        });

        expect(errors).to.be.null;
        expect(query!("first")).to.eql([]);
        expect(query!("second/third")).to.eql([]);
    });

    it("-first, -second, -third", () => {
        const { query, errors } = parser({});

        expect(errors).to.be.eql([
            propertyError("second", ""),
        ]);
        expect(query).to.be.null;
    });
});
