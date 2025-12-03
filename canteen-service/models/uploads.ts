import { join } from "path";
import { localData } from "./local-data";
import { getFiles } from "./files";

const root = join(localData(), 'uploads');

export async function getUploads(): Promise<string[]> {
    return getFiles(root);
}