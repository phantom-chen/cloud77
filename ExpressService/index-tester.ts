import { lookup, resolve4 } from 'dns';
import { parseURL } from './apps/domain';
import { homedir, networkInterfaces, type } from 'os';
import { getHeapStatistics } from 'v8';

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