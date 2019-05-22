import { JsonParser } from "./types";
import { JsonIterator, QueryVisitor } from "../query";
import { JsonParseError, handleErrors, propertyError } from "./errors";
import { flatten } from "../utils";

const wildcard = "*";

export const prop = (name: string, valueParser: JsonParser): JsonParser => (val: any, path: string): JsonIterator | JsonParseError[] => {
    if (name !== wildcard && !(name in val)) {
        return [propertyError(name, path)];
    }

    const propNames = name === wildcard ? Object.getOwnPropertyNames(val) : [name];

    const results = propNames.map(propName => valueParser(val[propName], `${path}/${propName}`));

    const { queries, errors } = handleErrors(results);
    if (errors.length > 0) {
        return errors;
    }

    return (visitor: QueryVisitor) => flatten(queries.map((query, index: number) => {
        if (visitor.goDown(propNames[index])) {
            const result = query(visitor);
            visitor.goUp();
            return result;
        }
        return [];
    }));
};

export const propAny = (valueParser: JsonParser): JsonParser => prop(wildcard, valueParser);
