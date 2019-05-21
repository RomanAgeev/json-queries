import { JsonIterator, JsonQuery } from "../query";
import { JsonParseError } from "./errors";

export type JsonParser = (obj: any, path: string) => JsonIterator | JsonParseError[];

export type JsonRootParser = (obj: any) => { query: JsonQuery | null, errors: JsonParseError[] | null };
