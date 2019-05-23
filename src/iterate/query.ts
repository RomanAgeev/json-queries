export type Query = (path: string, predicate?: Predicate) => QueryResult[];

export type Predicate = (value: any) => boolean;

export interface QueryResult {
    value: any;
    path: string;
}
