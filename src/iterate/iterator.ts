import { Visitor } from "./visitor";
import { QueryResult } from "./query";

export type Iterator = (visitor: Visitor) => QueryResult[];

export const iterate = (iterator: Iterator, visitor: Visitor, segment: string): QueryResult[] => {
    if (visitor.goDown(segment)) {
        const result = iterator(visitor);
        visitor.goUp();
        return result;
    }
    return [];
};
