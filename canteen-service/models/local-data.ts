import { join } from 'path';
import { existsSync, mkdirSync, writeFile } from 'fs';
import { platform } from 'os';

// MyServices or data
//   localhost.txt
//   logs
//   errors
//   sample
//     documents
//     posts
//     uploads
//     connections.txt
//     rooms.json

let _root = 'data';
let _data = 'data/sample';
console.log(process.env.PROGRAMDATA);
if (platform() === 'win32') {
    if (!existsSync(join(process.env.PROGRAMDATA || '', 'MyServices', "logs"))) {
        mkdirSync(join(process.env.PROGRAMDATA || '', 'MyServices', "logs"), { recursive: true });
    }

    _root = join(process.env.PROGRAMDATA || '', 'MyServices');
    _data = join(process.env.PROGRAMDATA || '', 'MyServices', 'sample');
}

if (!existsSync(_data)) {
    mkdirSync(_data, { recursive: true });
}

if (!existsSync(join(_data, 'documents'))) {
    mkdirSync(join(_data, 'documents'), { recursive: true });
}

if (!existsSync(join(_data, 'uploads'))) {
    mkdirSync(join(_data, 'uploads'), { recursive: true });
}

// writeFile(join(_data, 'connections.txt'), 'hello world', (err) => {
//     if (err) {
//         console.error("Error creating connections file:", err);
//     }
//     console.log("Connections file created successfully at:", join(_data, 'connections.txt'));
// });

export function localData(): string {
    return _data;
}

export function rootData(): string {
    return _root;
}