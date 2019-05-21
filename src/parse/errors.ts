import { JsonIterator } from "../query";

export class JsonParseError {
    constructor(
        public readonly message: string,
        public readonly path: string) {
    }
}

export const handleErrors = (results: (JsonIterator | JsonParseError[])[]): { queries: JsonIterator[], errors: JsonParseError[] } =>
    results.reduce((acc: { queries: JsonIterator[], errors: JsonParseError[] }, result) =>
        isJsonParseError(result) ?
            { ...acc, errors: [...acc.errors, ...result] } :
            { ...acc, queries: [...acc.queries, result] },
        { queries: [], errors: [] });

export const isJsonParseError = (value: any): value is JsonParseError[] =>
    value instanceof Array && (value.length === 0 || value[0] instanceof JsonParseError);
