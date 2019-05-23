import { normalizeSegments, pathToSegments, segmentsToPath, matchAnySegment } from "../utils";
import { Predicate } from "./json-query";

export class QueryVisitor {
    constructor(
        path: string,
        private readonly _predicate: Predicate) {
            this._segments = normalizeSegments(pathToSegments(path));
    }

    private _segments: string[];
    private _accumulator: string[] = [];

    public get currentPath() {
        return segmentsToPath(this._accumulator);
    }

    private get _index(): number {
        return this._accumulator.length;
    }

    public found(value: any): boolean {
        return this._index === this._segments.length && this._predicate(value);
    }

    public goDown(segment: string): boolean {
        if (this._matchSegment(segment)) {
            this._accumulator.push(segment);
            return true;
        }
        return false;
    }

    public goUp(): void {
        this._accumulator.pop();
    }

    private _matchSegment(segment: string): boolean {
        const segmentSample: string = this._segments[this._index];
        return matchAnySegment(segmentSample) || segmentSample === segment;
    }
}