import * as dotenv from 'dotenv';
import { argv } from 'process';
import { ensureDirectory, readContent, updateContent } from './models';
import path from 'path';

import { count, createEntities } from './models/bookmark';
import { generate } from 'short-uuid';
import { homedir, type } from 'os';

dotenv.config();
console.log(homedir());
console.log(type());
console.log('index.ts starts');
console.log(__dirname);
console.log(__filename);
console.log(process.env.USER_NAME);

console.log('-----------------------');

// print arguments
argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
});

ensureDirectory(path.join(__dirname, 'bin', "dir1"));
readContent(path.join(__dirname, 'bin', "file1.txt")).then((data) => {
    if (!data) {
        updateContent(path.join(__dirname, 'bin', "file1.txt"), 'hello world').then(() => {
            console.log('File updated successfully');
        });
    } else {
        console.log('File already has content:', data);
    }
});

createEntities('bin/app.db');
count().then(res => { console.log(res) })
console.log(generate().toString());