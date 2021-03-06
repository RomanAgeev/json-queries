import { Iterator, Visitor } from "../iterate";
import { ParseError, valueError } from "./errors";
import { JsonParser } from "./parse-json";

export type JsonValueType = "string" | "number" | "boolean";

export type VariableResolver = (variableName: string) => any;

export const value = (type: JsonValueType, resolver: VariableResolver = envResolver): JsonParser =>
    (val: any, path: string): Iterator | ParseError[] => {
        let resolvedValue = val;

        if (typeof val === "string") {
            const variable = parseVariable(val);
            if (variable) {
                resolvedValue = resolver(variable.variableName);
                if (!resolvedValue) {
                    resolvedValue = variable.defaultValue;
                    switch (type) {
                        case "number":
                            resolvedValue = Number(resolvedValue);
                            break;
                        case "boolean":
                            resolvedValue = Boolean(resolvedValue);
                            break;
                    }
                }
            }
        }

        if (!resolvedValue || typeof resolvedValue === type) {
            return (visitor: Visitor) =>
                visitor.found(val) ?
                    [{ value: resolvedValue, path: visitor.currentPath }] :
                    [];
        }
        return [valueError(type, resolvedValue, path)];
};

const envResolver: VariableResolver = variableName => process.env[variableName];

const regexp = /^\$\{(\w+)(\-([^\}]+))?\}$/;

const parseVariable = (val: any): { variableName: string, defaultValue?: string } | null => {
    const matchArray = val.match(regexp);
    if (matchArray) {
        const [_, variableName, __, defaultValue] = matchArray;
        return defaultValue ? { variableName, defaultValue } : { variableName };
    }
    return null;
};
