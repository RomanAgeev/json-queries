import { JsonIterator, QueryVisitor } from "../query";
import { JsonParseError, valueError } from "./errors";

export type JsonValueType = "string" | "number" | "boolean";

export const value = (type: JsonValueType) => (val: any, path: string): JsonIterator | JsonParseError[] => {
    if (typeof val === type) {
        return (visitor: QueryVisitor) =>
            visitor.found ?
                [{ value: val, path: visitor.currentPath }] :
                [];
    }
    return [valueError(type, val, path)];
};
