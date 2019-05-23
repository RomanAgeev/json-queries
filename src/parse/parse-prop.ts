import { Iterator, Visitor, iterate } from "../iterate";
import { ParseError, handleErrors, propertyError } from "./errors";
import { flatten, segmentsToPath } from "../utils";
import { JsonParser } from "./parse-json";

const markAny = "*";
const markOptional = "?";

const isAnyProp = (name: string): boolean => name === markAny;

const isOptionalProp = (name: string): boolean => name.length > 1 && name.endsWith(markOptional);

const optionalToName = (optionalName: string): string => optionalName.substring(0, optionalName.length - 1);

export const prop = (name: string, valueParser: JsonParser): JsonParser => (val: any, path: string): Iterator | ParseError[] => {
    let propNames: string[];

    if (isAnyProp(name)) {
        propNames = Object.getOwnPropertyNames(val);

    } else if (isOptionalProp(name)) {
        const propName = optionalToName(name);

        if (!(propName in val)) {
            return () => [];
        }
        propNames = [propName];

    } else if (!(name in val)) {
        return [propertyError(name, path)];

    } else {
        propNames = [name];
    }

    const results = propNames.map(propName => valueParser(val[propName], segmentsToPath([path, propName])));

    const { iterators, errors } = handleErrors(results);
    if (errors.length > 0) {
        return errors;
    }

    return (visitor: Visitor) =>
        flatten(iterators.map((iterator, index: number) =>
            iterate(iterator, visitor, propNames[index])));
};

export const propAny = (valueParser: JsonParser): JsonParser => prop(markAny, valueParser);

export const propOptional = (name: string, valueParser: JsonParser): JsonParser => prop(`${name}${markOptional}`, valueParser);
