import { Iterator, Visitor } from "../iterate";
import { ParseError, valueError } from "./errors";
import { JsonParser } from "./parse-json";

export type JsonValueType = "string" | "number" | "boolean";

export const value = (type: JsonValueType): JsonParser => (val: any, path: string): Iterator | ParseError[] => {
    if (typeof val === type) {
        return (visitor: Visitor) =>
            visitor.found(val) ?
                [{ value: val, path: visitor.currentPath }] :
                [];
    }
    return [valueError(type, val, path)];
};
