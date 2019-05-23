import { JsonParser, JsonRootParser, obj, isJsonParseError } from "./parse";
import { Predicate, QueryVisitor } from "./query";

export const json = (propParsers: JsonParser[]): JsonRootParser => {
    const mapParser = obj(propParsers);

    return val => {
        const result = mapParser(val, "");

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
