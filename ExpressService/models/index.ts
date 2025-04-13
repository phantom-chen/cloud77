import { existsSync, accessSync, mkdir, constants, writeFile, readFile } from "fs";

let count = 0;

const tick = () => {
    return count++;
}

const add = (x: number, y: number) => {
    return x * x + y * y;
}

export default { tick, add }

export function tick2() {
    return tick();
}

export function ensureDirectory(dir: string): void {
    if (existsSync(dir)) {
        return;
    } else {
        mkdir(dir, { recursive: true }, (err) => {
            if (err) {
                console.error(`Failed to create directory: ${dir}`, err);
            } else {
                console.log(`Directory created: ${dir}`);
            }
        });
    }
}

export function readContent(file: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (existsSync(file)) {
            // access
            try {
                // check if file is accessible
                accessSync(file, constants.R_OK | constants.W_OK);

                readFile(file, 'utf8', (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data.toString())
                    }
                });
            } catch (err) {
                console.error('no access!');
                reject(err);
            }
        } else {
            writeFile(file, '', (err) => {
                if (err) {
                    console.error('Failed to create file:', err);
                    reject(err);
                } else {
                    console.log('File created successfully');
                    resolve('');
                }
            });
        }
    });
}

export function updateContent(file: string, content: string): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            // check if file is accessible
            accessSync(file, constants.R_OK | constants.W_OK);
            // update content
            
            writeFile(file, content, (err) => {
                if (err) {
                    console.error('Failed to write file:', err);
                    reject(err);
                } else {
                    console.log('File written successfully');
                    resolve();
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}
