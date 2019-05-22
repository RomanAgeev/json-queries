import { describe, it } from "mocha";
import { expect } from "chai";
import { json, prop, value, map, array } from "../src";

describe("json -> complex", () => {
    const parser = json([
        prop("first", value("boolean")),
        prop("second", map([
            prop("*", array(map([
                prop("x", value("number")),
                prop("y", value("number")),
            ]))),
        ])),
        prop("third", map([
            prop("forth", map([
                prop("fifth", map([
                    prop("leaf", value("string")),
                ])),
            ])),
        ])),
    ]);

    const { query, errors } = parser({
        first: true,
        second: {
            prop1: [
                { x: 1, y: 2 },
                { x: 3, y: 4 },
            ],
            prop2: [
                { x: 10, y: 20 },
                { x: 30, y: 40 },
            ],
        },
        third: {
            forth: {
                fifth: {
                    leaf: "test leaf",
                },
            },
        },
    });

    it("find first", () => {
        expect(query).to.be.not.null;

        expect(query!.findMany("first")).to.be.eql([
            { value: true, path: "first" },
        ]);
    });

    it("find second * -> * -> *", () => {
        expect(query).to.be.not.null;

        expect(query!.findMany("second/*/*/*")).to.be.eql([
            { value: 1, path: "second/prop1/0/x" },
            { value: 2, path: "second/prop1/0/y" },
            { value: 3, path: "second/prop1/1/x" },
            { value: 4, path: "second/prop1/1/y" },
            { value: 10, path: "second/prop2/0/x" },
            { value: 20, path: "second/prop2/0/y" },
            { value: 30, path: "second/prop2/1/x" },
            { value: 40, path: "second/prop2/1/y" },
        ]);
    });

    it("find second * -> * -> x", () => {
        expect(query).to.be.not.null;

        expect(query!.findMany("second/*/*/x")).to.be.eql([
            { value: 1, path: "second/prop1/0/x" },
            { value: 3, path: "second/prop1/1/x" },
            { value: 10, path: "second/prop2/0/x" },
            { value: 30, path: "second/prop2/1/x" },
        ]);
    });

    it("find second * -> 1 -> *", () => {
        expect(query).to.be.not.null;

        expect(query!.findMany("second/*/1/*")).to.be.eql([
            { value: 3, path: "second/prop1/1/x" },
            { value: 4, path: "second/prop1/1/y" },
            { value: 30, path: "second/prop2/1/x" },
            { value: 40, path: "second/prop2/1/y" },
        ]);
    });

    it("find second prop2 -> * -> *", () => {
        expect(query).to.be.not.null;

        expect(query!.findMany("second/prop2/*/*")).to.be.eql([
            { value: 10, path: "second/prop2/0/x" },
            { value: 20, path: "second/prop2/0/y" },
            { value: 30, path: "second/prop2/1/x" },
            { value: 40, path: "second/prop2/1/y" },
        ]);
    });

    it("find second prop2 -> * -> x", () => {
        expect(query).to.be.not.null;

        expect(query!.findMany("second/prop2/*/x")).to.be.eql([
            { value: 10, path: "second/prop2/0/x" },
            { value: 30, path: "second/prop2/1/x" },
        ]);
    });

    it("find second prop2 -> 1 -> *", () => {
        expect(query).to.be.not.null;

        expect(query!.findMany("second/prop2/1/*")).to.be.eql([
            { value: 30, path: "second/prop2/1/x" },
            { value: 40, path: "second/prop2/1/y" },
        ]);
    });

    it("find second prop2 -> 1 -> y", () => {
        expect(query).to.be.not.null;

        expect(query!.findMany("second/prop2/1/y")).to.be.eql([
            { value: 40, path: "second/prop2/1/y" },
        ]);
    });

    it("find third -> forth -> fifth -> *", () => {
        expect(query).to.be.not.null;

        expect(query!.findMany("third/forth/fifth/*")).to.be.eql([
            { value: "test leaf", path: "third/forth/fifth/leaf" },
        ]);
    });

    it("find third -> forth -> fifth -> leaf", () => {
        expect(query).to.be.not.null;

        expect(query!.findMany("third/forth/fifth/leaf")).to.be.eql([
            { value: "test leaf", path: "third/forth/fifth/leaf" },
        ]);
    });
});
