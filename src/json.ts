import { JsonParser, JsonRootParser, map, isJsonParseError } from "./parse";
import { JsonQuery } from "./query";

export const json = (propParsers: JsonParser[]): JsonRootParser => {
    const mapParser = map(propParsers);

    return obj => {
        const result = mapParser(obj, "");

        return isJsonParseError(result) ?
            { query: null, errors: result } :
            { query: new JsonQuery(result), errors: null };
    };
};
