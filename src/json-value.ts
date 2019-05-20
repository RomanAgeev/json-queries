import { JsonQuery, JsonParseResult } from "./json-query";
import { JsonParseError } from "./json-parse-error";
import { JsonQueryResult } from "./json-query-result";
import { QueryVisitor } from "./json-query-visitor";

export type JsonValueType = "string" | "number" | "boolean";

export const value = (type: JsonValueType) => (obj: any, path: string = ""): JsonParseResult =>
    typeof obj === type ?
        new JsonQuery((visitor: QueryVisitor) => [visitor.found ? [new JsonQueryResult(obj, visitor.path)] : []]) :
        [new JsonParseError(`value of type ${type} is expected, but "${obj}" is provided`, path)];
