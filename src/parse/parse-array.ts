import { JsonParser } from "./types";
import { JsonIterator, QueryVisitor } from "../query";
import { JsonParseError, handleErrors, arrayError } from "./errors";
import { flatten } from "../utils";

export const array = (itemParser: JsonParser): JsonParser => (obj: any, path: string): JsonIterator | JsonParseError[] => {
    if (obj && obj instanceof Array) {
        const results = obj.map((item: any, index: number) => itemParser(item, `${path}/${index}`));

        const { queries, errors } = handleErrors(results);
        if (errors.length  > 0) {
            return errors;
        }

        return (visitor: QueryVisitor) =>
            visitor.found ?
                [{ value: obj, path: visitor.path }] :
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
