import { describe, it } from "mocha";
import { expect } from "chai";
import { json, prop, value, obj, array, propAny } from "../src";

describe("json -> complex", () => {
    const parser = json([
        prop("first", value("boolean")),
        prop("second", obj([
            propAny(array(obj([
                prop("x", value("number")),
                prop("y", value("number")),
            ]))),
        ])),
        prop("third", obj([
            prop("forth", obj([
                prop("fifth", obj([
                    prop("leaf", value("string")),
                ])),
            ])),
        ])),
    ]);

    const testJson = {
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
    };

    const { query, errors } = parser(testJson);

    expect(errors).to.be.null;
    expect(query).to.be.not.null;

    it("find first", () => {
        expect(query!.findMany("first")).to.be.eql([
            { value: true, path: "first" },
        ]);
    });

    it("find second * -> * -> *", () => {
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
        expect(query!.findMany("second/*/*/x")).to.be.eql([
            { value: 1, path: "second/prop1/0/x" },
            { value: 3, path: "second/prop1/1/x" },
            { value: 10, path: "second/prop2/0/x" },
            { value: 30, path: "second/prop2/1/x" },
        ]);
    });

    it("find second * -> 1 -> *", () => {
        expect(query!.findMany("second/*/1/*")).to.be.eql([
            { value: 3, path: "second/prop1/1/x" },
            { value: 4, path: "second/prop1/1/y" },
            { value: 30, path: "second/prop2/1/x" },
            { value: 40, path: "second/prop2/1/y" },
        ]);
    });

    it("find second prop2 -> * -> *", () => {
        expect(query!.findMany("second/prop2/*/*")).to.be.eql([
            { value: 10, path: "second/prop2/0/x" },
            { value: 20, path: "second/prop2/0/y" },
            { value: 30, path: "second/prop2/1/x" },
            { value: 40, path: "second/prop2/1/y" },
        ]);
    });

    it("find second prop2 -> * -> x", () => {
        expect(query!.findMany("second/prop2/*/x")).to.be.eql([
            { value: 10, path: "second/prop2/0/x" },
            { value: 30, path: "second/prop2/1/x" },
        ]);
    });

    it("find second prop2 -> 1 -> *", () => {
        expect(query!.findMany("second/prop2/1/*")).to.be.eql([
            { value: 30, path: "second/prop2/1/x" },
            { value: 40, path: "second/prop2/1/y" },
        ]);
    });

    it("find second prop2 -> 1 -> y", () => {
        expect(query!.findMany("second/prop2/1/y")).to.be.eql([
            { value: 40, path: "second/prop2/1/y" },
        ]);
    });

    it("find third -> forth -> fifth -> *", () => {
        expect(query!.findMany("third/forth/fifth/*")).to.be.eql([
            { value: "test leaf", path: "third/forth/fifth/leaf" },
        ]);
    });

    it("find third -> forth -> fifth -> leaf", () => {
        expect(query!.findMany("third/forth/fifth/leaf")).to.be.eql([
            { value: "test leaf", path: "third/forth/fifth/leaf" },
        ]);
    });

    it("find *", () => {
        expect(query!.findMany("*")).to.be.eql([
            { value: true, path: "first" },
            { value: testJson.second, path: "second" },
            { value: testJson.third, path: "third" },
        ]);
    });

    it("find * -> *", () => {
        expect(query!.findMany("*/*")).to.be.eql([
            { value: testJson.second.prop1, path: "second/prop1" },
            { value: testJson.second.prop2, path: "second/prop2" },
            { value: testJson.third.forth, path: "third/forth" },
        ]);
    });

    it("find * -> * -> *", () => {
        expect(query!.findMany("*/*/*")).to.be.eql([
            { value: testJson.second.prop1[0], path: "second/prop1/0" },
            { value: testJson.second.prop1[1], path: "second/prop1/1" },
            { value: testJson.second.prop2[0], path: "second/prop2/0" },
            { value: testJson.second.prop2[1], path: "second/prop2/1" },
            { value: testJson.third.forth.fifth, path: "third/forth/fifth" },
        ]);
    });

    it("find * -> * -> * -> *", () => {
        expect(query!.findMany("*/*/*/*")).to.be.eql([
            { value: testJson.second.prop1[0].x, path: "second/prop1/0/x" },
            { value: testJson.second.prop1[0].y, path: "second/prop1/0/y" },
            { value: testJson.second.prop1[1].x, path: "second/prop1/1/x" },
            { value: testJson.second.prop1[1].y, path: "second/prop1/1/y" },
            { value: testJson.second.prop2[0].x, path: "second/prop2/0/x" },
            { value: testJson.second.prop2[0].y, path: "second/prop2/0/y" },
            { value: testJson.second.prop2[1].x, path: "second/prop2/1/x" },
            { value: testJson.second.prop2[1].y, path: "second/prop2/1/y" },
            { value: testJson.third.forth.fifth.leaf, path: "third/forth/fifth/leaf" },
        ]);
    });

    it("find * -> * -> * -> * -> *", () => {
        expect(query!.findMany("*/*/*/*/*")).to.be.eql([]);
    });

    it("path normalization", () => {
        expect(query!.findMany("second/prop1/0/x/../y")).to.be.eql([
            { value: 2, path: "second/prop1/0/y" },
        ]);

        expect(query!.findMany("second/prop1/0/x/../../1/x")).to.be.eql([
            { value: 3, path: "second/prop1/1/x" },
        ]);

        expect(query!.findMany("second/prop1/0/x/../../../prop2/0/y")).to.be.eql([
            { value: 20, path: "second/prop2/0/y" },
        ]);

        expect(query!.findMany("second/prop1/0/x/../../../../third/forth/fifth/leaf")).to.be.eql([
            { value: "test leaf", path: "third/forth/fifth/leaf" },
        ]);
    });

    it("find with predicate * -> * -> x", () => {
        expect(query!.findMany("second/*/*/x", val => val === 10)).to.be.eql([
            { value: 10, path: "second/prop2/0/x" },
        ]);
    });

});
