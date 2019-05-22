export const flatten = <T>(arrays: T[][]): T[] => arrays.reduce((acc: T[], item: T[]) => [...acc, ...item], []);

export function normalizeSegments(segments: string[]): string[] {
    const result: string[] = [];
    for (const segment of segments) {
        if (segment === segmentUp) {
            result.pop();
        } else {
            result.push(segment);
        }
    }
    return result;
}

export const pathToSegments = (path: string): string[] => path.split(segmentSeparator);
export const segmentsToPath = (segments: string[]): string => segments.join(segmentSeparator);
export const matchAnySegment = (segment: string): boolean => segment === segmentAny;

const segmentAny = "*";
const segmentUp = "..";
const segmentSeparator = "/";
