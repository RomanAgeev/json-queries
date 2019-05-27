import { Iterator, Visitor } from "../iterate";
import { ParseError, variableError } from "./errors";
import { JsonParser } from "./parse-json";

const regexp = /^\$\{(\w+)\}$/;

export const variable = (resolver: (variableName: string) => any): JsonParser => (val: any, path: string): Iterator | ParseError[] => {
    if (typeof val === "string") {
        const matchArray = val.match(regexp);
        if (matchArray && matchArray.length === 2) {
            const varName: string = matchArray[1];

            return (visitor: Visitor) =>
                visitor.found(val) ?
                    [{ value: resolver(varName), path: visitor.currentPath }] :
                    [];
        }
    }
    return [variableError(val, path)];
};

export const envVariable = (): JsonParser => variable(variableName => process.env[variableName]);
