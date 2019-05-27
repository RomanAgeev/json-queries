import { Iterator } from "../iterate";
import { JsonValueType } from "./parse-value";

export class ParseError {
    constructor(
        public readonly message: string,
        public readonly path: string) {
    }
}

export const handleErrors = (results: (Iterator | ParseError[])[]): { iterators: Iterator[], errors: ParseError[] } =>
    results.reduce((acc: { iterators: Iterator[], errors: ParseError[] }, result) =>
        isJsonParseError(result) ?
            { ...acc, errors: [...acc.errors, ...result] } :
            { ...acc, iterators: [...acc.iterators, result] },
        { iterators: [], errors: [] });

export const isJsonParseError = (value: any): value is ParseError[] =>
    value instanceof Array && (value.length === 0 || value[0] instanceof ParseError);

export const arrayError = (path: string) => new ParseError("array is expected", path);

export const objectError = (path: string) => new ParseError("object is expected", path);

export const propertyError = (name: string, path: string) => new ParseError(`property ${name} is expected`, path);

export const valueError = (type: JsonValueType, obj: any, path: string) =>
    new ParseError(`value of type ${type} is expected, but "${obj}" is provided`, path);

export const variableError = (obj: any, path: string) =>
    new ParseError(`variable \${VAR_NAME} is expected, but "${obj}" is provided`, path);
