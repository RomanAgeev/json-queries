import { JsonParser } from "./types";
import { JsonIterator, QueryVisitor } from "../query";
import { JsonParseError, handleErrors, objectError } from "./errors";
import { flatten } from "../utils";

export const obj = (propParsers: JsonParser[]): JsonParser => (val: any, path: string): JsonIterator | JsonParseError[] => {
    if (val && typeof val === "object" && !(val instanceof Array)) {
        const results = val ? propParsers.map(propParser => propParser(val, path)) : [];

        const { queries, errors } = handleErrors(results);
        if (errors.length  > 0) {
            return errors;
        }

        return (visitor: QueryVisitor) =>
            visitor.found ?
                [{ value: val, path: visitor.currentPath }] :
                flatten(queries.map(query => query(visitor)));
    }
    return [objectError(path)];
};
