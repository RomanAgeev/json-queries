import { Iterator, Visitor } from "../iterate";
import { ParseError, handleErrors, objectError } from "./errors";
import { flatten } from "../utils";
import { JsonParser } from "./parse-json";

export const obj = (propParsers: JsonParser[]): JsonParser => (val: any, path: string): Iterator | ParseError[] => {
    if (val && typeof val === "object" && !(val instanceof Array)) {
        const results = val ? propParsers.map(propParser => propParser(val, path)) : [];

        const { iterators, errors } = handleErrors(results);
        if (errors.length  > 0) {
            return errors;
        }

        return (visitor: Visitor) =>
            visitor.found(val) ?
                [{ value: val, path: visitor.currentPath }] :
                flatten(iterators.map(iterator => iterator(visitor)));
    }
    return [objectError(path)];
};
