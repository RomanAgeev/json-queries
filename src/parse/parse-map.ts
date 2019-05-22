import { JsonParser } from "./types";
import { JsonIterator, QueryVisitor } from "../query";
import { JsonParseError, handleErrors, objectError } from "./errors";
import { flatten } from "../utils";

export const map = (propParsers: JsonParser[]): JsonParser => (obj: any, path: string): JsonIterator | JsonParseError[] => {
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
        const results = obj ? propParsers.map(propParser => propParser(obj, path)) : [];

        const { queries, errors } = handleErrors(results);
        if (errors.length  > 0) {
            return errors;
        }

        return (visitor: QueryVisitor) =>
            visitor.found ?
                [{ value: obj, path: visitor.path }] :
                flatten(queries.map(query => query(visitor)));
    }
    return [objectError(path)];
};
