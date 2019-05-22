import { normalizeSegments, pathToSegments, segmentsToPath, matchAnySegment } from "../utils";

export class QueryVisitor {
    constructor(path: string) {
        this._segments = normalizeSegments(pathToSegments(path));
    }

    private _segments: string[];
    private _accumulator: string[] = [];

    public get currentPath() {
        return segmentsToPath(this._accumulator);
    }

    public get found(): boolean {
        return this._index === this._segments.length;
    }

    private get _index(): number {
        return this._accumulator.length;
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