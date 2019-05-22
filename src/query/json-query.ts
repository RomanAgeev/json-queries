import { JsonIterator } from "./json-iterator";
import { JsonQueryResult } from "./json-query-result";
import { QueryVisitor } from "./query-visitor";

export class JsonQuery {
    constructor(
        private readonly _iterator: JsonIterator) {
    }

    findMany(path: string): JsonQueryResult[] {
        return this._iterator(new QueryVisitor(path));
    }
}
