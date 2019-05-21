export const flatten = <T>(arrays: T[][]): T[] => arrays.reduce((acc: T[], item: T[]) => [...acc, ...item], []);
