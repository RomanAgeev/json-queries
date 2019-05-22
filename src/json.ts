import { JsonParser, JsonRootParser, obj, isJsonParseError } from "./parse";
import { JsonQuery } from "./query";

export const json = (propParsers: JsonParser[]): JsonRootParser => {
    const mapParser = obj(propParsers);

    return val => {
        const result = mapParser(val, "");

        return isJsonParseError(result) ?
            { query: null, errors: result } :
            { query: new JsonQuery(result), errors: null };
    };
};
