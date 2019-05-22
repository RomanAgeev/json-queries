import { JsonIterator } from "../query";
import { JsonValueType } from "./parse-value";

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

export const arrayError = (path: string) => new JsonParseError("array is expected", path);
export const objectError = (path: string) => new JsonParseError("object is expected", path);
export const propertyError = (name: string, path: string) => new JsonParseError(`property ${name} is expected`, path);
export const valueError = (type: JsonValueType, obj: any, path: string) =>
    new JsonParseError(`value of type ${type} is expected, but "${obj}" is provided`, path);
