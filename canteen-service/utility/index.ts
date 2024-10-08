import { existsSync, readdir, statSync } from 'fs';
import path from 'path';

export function getFiles(dir: string): Promise<string[]> {
    return new Promise((resolve, reject) => {

        if (existsSync(dir)) {
            readdir(dir, async (err, files) => {
                if (err) {
                    console.log(err);
                    resolve([]);
                } else {
                    let items: string[] = [];
                    for (const file of files) {
                        const stats = statSync(path.join(dir, file));
                        if (stats.isFile()) {
                            items.push(path.join(dir, file));
                        } else {
                            const subItems = await getFiles(path.join(dir, file));
                            items = items.concat(subItems);
                        }
                    }
                    resolve(items);
                }
            })
        } else {
            resolve([]);
        }
    })
}

const Codes = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export function generateID(length: number): string {
    let id = '';
    for (let i = 0; i < length - 1; i++) {
        id += Codes.charAt(Math.floor(Math.random() * Codes.length));
    }

    return id;
}