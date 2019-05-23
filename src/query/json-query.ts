import { JsonQueryResult } from "./json-query-result";

export type JsonQuery = (path: string, predicate?: Predicate) => JsonQueryResult[];

export type Predicate = (value: any) => boolean;
