import * as dotenv from 'dotenv';
import { argv } from 'process';
import { ensureDirectory, readContent, updateContent } from './models';
import path from 'path';
import { lookup, resolve4 } from 'dns';
import { parseURL } from './apps/domain';
import { homedir, networkInterfaces, type } from 'os';
import { getHeapStatistics } from 'v8';
import { decrypt, encrypt, hashPassword, verifyPassword } from './apps/user';

dotenv.config();
console.log(homedir());
console.log(type());
console.log('index.ts starts');
console.log(__dirname);
console.log(__filename);
console.log(process.env.USER_NAME);

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

const hostname = process.env.HOST_NAME || '';
lookup(hostname, (err, address, family) => {
    if (!err) {
        console.log(address);
        console.log(family);
    }
})

resolve4(hostname, (err, addresses) => {
    if (!err) {
        console.log(addresses);
    }
})

parseURL('http://Chyingp:HelloWorld@ke.qq.com:8080/index.html?nick=%E7%A8%8B%E5%BA%8F%E7%8C%BF%E5%B0%8F%E5%8D%A1#part=1');

const interfaces = networkInterfaces();
for (const item in interfaces) {
    console.log(interfaces[item]);
}

console.log(getHeapStatistics());

// Example usage
const textToEncrypt = 'Hello, World!';
const encrypted = encrypt(textToEncrypt);
console.log('Encrypted:', encrypted);

const decrypted = decrypt(encrypted.encryptedData, encrypted.iv);
console.log('Decrypted:', decrypted);

const hashed = hashPassword('abc123#');
console.log(hashed);
console.log(verifyPassword('abc123#', hashed));
console.log(verifyPassword('abc123', hashed));