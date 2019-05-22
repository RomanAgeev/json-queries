import { QueryVisitor } from "./query-visitor";
import { JsonQueryResult } from "./json-query-result";

export type JsonIterator = (visitor: QueryVisitor) => JsonQueryResult[];

export const executeQuery = (query: JsonIterator, visitor: QueryVisitor, segment: string): JsonQueryResult[] => {
    if (visitor.goDown(segment)) {
        const result = query(visitor);
        visitor.goUp();
        return result;
    }
    return [];
};
