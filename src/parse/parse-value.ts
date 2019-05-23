import { Iterator, Visitor } from "../iterate";
import { ParseError, valueError } from "./errors";

export type JsonValueType = "string" | "number" | "boolean";

export const value = (type: JsonValueType) => (val: any, path: string): Iterator | ParseError[] => {
    if (typeof val === type) {
        return (visitor: Visitor) =>
            visitor.found(val) ?
                [{ value: val, path: visitor.currentPath }] :
                [];
    }
    return [valueError(type, val, path)];
};
