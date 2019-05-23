import { JsonParser, JsonRootParser } from "./types";
import { obj } from "./parse-obj";
import { isJsonParseError } from "./errors";
import { Predicate, QueryVisitor } from "../query";

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
                query: (path: string, predicate: Predicate = () => true) => result(new QueryVisitor(path, predicate)),
                errors: null,
            };
    };
};
