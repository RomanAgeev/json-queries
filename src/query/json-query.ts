import { JsonIterator } from "./json-iterator";
import { JsonQueryResult } from "./json-query-result";
import { QueryVisitor } from "./query-visitor";

export class JsonQuery {
    constructor(
        private readonly _iterator: JsonIterator) {
    }

    findMany(path: string): JsonQueryResult[] {
        const segments = this._normalizeSegments(path.split("/"));
        return this._iterator(new QueryVisitor(segments));
    }

    private _normalizeSegments(segments: string[]): string[] {
        const result: string[] = [];
        for (const segment of segments) {
            if (segment === ".") {
                result.pop();
            } else {
                result.push(segment);
            }
        }
        return result;
    }
}
