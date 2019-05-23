import { Iterator, Visitor, iterate } from "../iterate";
import { ParseError, handleErrors, arrayError } from "./errors";
import { flatten, segmentsToPath } from "../utils";
import { JsonParser } from "./parse-json";

export const array = (itemParser: JsonParser): JsonParser => (val: any, path: string): Iterator | ParseError[] => {
    if (val && val instanceof Array) {
        const results = val.map((item: any, index: number) => itemParser(item, segmentsToPath([path, `${index}`])));

        const { iterators, errors } = handleErrors(results);
        if (errors.length > 0) {
            return errors;
        }

        return (visitor: Visitor) =>
            visitor.found(val) ?
                [{ value: val, path: visitor.currentPath }] :
                flatten(iterators.map((iterator, index: number) =>
                    iterate(iterator, visitor, `${index}`)));
    }
    return [arrayError(path)];
};
