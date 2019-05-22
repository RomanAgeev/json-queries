import { JsonIterator, JsonQuery } from "../query";
import { JsonParseError } from "./errors";

export type JsonParser = (val: any, path: string) => JsonIterator | JsonParseError[];

export type JsonRootParser = (val: any) => { query: JsonQuery | null, errors: JsonParseError[] | null };
