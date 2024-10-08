// import { X2jOptions, X2jOptionsOptional, XMLBuilder, XMLParser } from "fast-xml-parser";

export default function hello() {
    console.log('hello');
}

function objectToArray<T>(object: T | T[]): T[] {
    if (!object) {
        return [];
    } else {
        if (Array.isArray(object)) {
            return object;
        } else {
            return [object];
        }
    }
}
