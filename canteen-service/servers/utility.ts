import fs from 'fs';

export function getVersion(): Promise<string> {
    return new Promise(resolve => {
        fs.readFile('version', function (err, data) {
            if (err) {
                resolve('1.0.0');
            }
            else
            {
                resolve(data.toString().trim());
            }
        });
    })
}