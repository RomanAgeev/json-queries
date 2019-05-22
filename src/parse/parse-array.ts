import { JsonParser } from "./types";
import { JsonIterator, QueryVisitor } from "../query";
import { JsonParseError, handleErrors, arrayError } from "./errors";
import { flatten } from "../utils";

export const array = (itemParser: JsonParser): JsonParser => (val: any, path: string): JsonIterator | JsonParseError[] => {
    if (val && val instanceof Array) {
        const results = val.map((item: any, index: number) => itemParser(item, `${path}/${index}`));

        const { queries, errors } = handleErrors(results);
        if (errors.length > 0) {
            return errors;
        }

        return (visitor: QueryVisitor) =>
            visitor.found ?
                [{ value: val, path: visitor.currentPath }] :
                flatten(queries.map((query, index: number) => {
                    if (visitor.goDown(`${index}`)) {
                        const result = query(visitor);
                        visitor.goUp();
                        return result;
                    }
                    return [];
                }));
    }
    return [arrayError(path)];
};
