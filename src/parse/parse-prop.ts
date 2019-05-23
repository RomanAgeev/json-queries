import { JsonParser } from "./types";
import { JsonIterator, QueryVisitor, iterate } from "../query";
import { JsonParseError, handleErrors, propertyError } from "./errors";
import { flatten, segmentsToPath } from "../utils";

const wildcard = "*";

export const prop = (name: string, valueParser: JsonParser): JsonParser => (val: any, path: string): JsonIterator | JsonParseError[] => {
    if (name !== wildcard && !(name in val)) {
        return [propertyError(name, path)];
    }

    const propNames = name === wildcard ? Object.getOwnPropertyNames(val) : [name];

    const results = propNames.map(propName => valueParser(val[propName], segmentsToPath([path, propName])));

    const { iterators, errors } = handleErrors(results);
    if (errors.length > 0) {
        return errors;
    }

    return (visitor: QueryVisitor) =>
        flatten(iterators.map((iterator, index: number) =>
            iterate(iterator, visitor, propNames[index])));
};

export const propAny = (valueParser: JsonParser): JsonParser => prop(wildcard, valueParser);
