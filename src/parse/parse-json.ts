import { obj } from "./parse-obj";
import { isJsonParseError, ParseError } from "./errors";
import { Predicate, Visitor, Iterator, Query } from "../iterate";

export const json = (propParsers: JsonParser[]): JsonRootParser => {
    const objParser = obj(propParsers);

    return val => {
        const result = objParser(val, "");

        return isJsonParseError(result) ?
            {
                query: null,
                errors: result,
            } :
            {
                query: (path: string, predicate: Predicate = () => true) => result(new Visitor(path, predicate)),
                errors: null,
            };
    };
};

export type JsonParser = (val: any, path: string) => Iterator | ParseError[];

export type JsonRootParser = (val: any) => { query: Query | null, errors: ParseError[] | null };
