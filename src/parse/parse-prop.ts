import { JsonParser } from "./types";
import { JsonIterator, QueryVisitor, executeQuery } from "../query";
import { JsonParseError, handleErrors, propertyError } from "./errors";
import { flatten, segmentsToPath } from "../utils";

const wildcard = "*";

export const prop = (name: string, valueParser: JsonParser): JsonParser => (val: any, path: string): JsonIterator | JsonParseError[] => {
    if (name !== wildcard && !(name in val)) {
        return [propertyError(name, path)];
    }

    const propNames = name === wildcard ? Object.getOwnPropertyNames(val) : [name];

    const results = propNames.map(propName => valueParser(val[propName], segmentsToPath([path, propName])));

    const { queries, errors } = handleErrors(results);
    if (errors.length > 0) {
        return errors;
    }

    return (visitor: QueryVisitor) =>
        flatten(queries.map((query, index: number) =>
            executeQuery(query, visitor, () => propNames[index])));
};

export const propAny = (valueParser: JsonParser): JsonParser => prop(wildcard, valueParser);
