import { QueryVisitor } from "./query-visitor";
import { JsonQueryResult } from "./json-query-result";

export type JsonIterator = (visitor: QueryVisitor) => JsonQueryResult[];
