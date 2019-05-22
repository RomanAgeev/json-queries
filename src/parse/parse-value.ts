import { JsonIterator, QueryVisitor } from "../query";
import { JsonParseError, valueError } from "./errors";

export type JsonValueType = "string" | "number" | "boolean";

export const value = (type: JsonValueType) => (obj: any, path: string): JsonIterator | JsonParseError[] => {
    if (typeof obj === type) {
        return (visitor: QueryVisitor) =>
            visitor.found ?
                [{ value: obj, path: visitor.path }] :
                [];
    }
    return [valueError(type, obj, path)];
};
