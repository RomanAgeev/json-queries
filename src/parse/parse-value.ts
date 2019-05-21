import { JsonIterator, QueryVisitor } from "../query";
import { JsonParseError } from "./errors";

export type JsonValueType = "string" | "number" | "boolean";

export const value = (type: JsonValueType) => (obj: any, path: string): JsonIterator | JsonParseError[] =>
    typeof obj === type ?
        (visitor: QueryVisitor) => visitor.found ? [{ value: obj, path: visitor.path }] : [] :
        [new JsonParseError(`value of type ${type} is expected, but "${obj}" is provided`, path)];
