export const valueToString = (value: any): string => {
    if (value === null) {
        return "null";
    }
    if (value === undefined) {
        return "undefined";
    }
    if (typeof value === "object") {
        return JSON.stringify(value);
    }
    return `${value}`;
};
