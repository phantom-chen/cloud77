// export function rabbitmqQueue(): string {
//     return settings.rabbitmq.queue;
// }

// export function redisClientSettings(): { host: string, port: number, password: string } {
//     return {
//         host: settings.redis.host,
//         port: Number(settings.redis.port),
//         password: settings.redis.password
//     }
// }

// export function consulSettings(): { host: string, port: string, enable: boolean } {
//     const host = settings.consul.host;
//     return {
//         host: host,
//         port: settings.consul.port,
//         enable: settings.consul.enable
//     }
// }

// export function getPort(): string {
//     const content = readFileSync('.env').toString();
//     return process.env.PORT || getEnvSetting(content, 'port');
// }

// export function getSocketSettings(): Promise<{
//     path: string,
//     origin: string[]
// }> {
//     return new Promise((resolve, reject) => {
//         readFile('.env', (err, data) => {
//             if (err) {
//                 console.log(err);
//                 resolve({
//                     path: '',
//                     origin: []
//                 });
//             } else {
//                 resolve({
//                     path: getEnvSetting(data.toString(), 'socketpath'),
//                     origin: getEnvSetting(data.toString(), 'socketorigin').split(',')
//                 });
//             }
//         })
//     })
// }

function getEnvSetting(settings: string, key: string): string {
    const lines = settings.split("\r\n");
    let index = 0;
    let notFound = true;
    let value = '';
    do {
        const line = lines[index].toLowerCase();
        notFound = !line.startsWith(`${key.toLowerCase()}=`);
        if (!notFound) {
            value = line.replace(`${key.toLowerCase()}=`, '');
        }
        index++;
    } while (notFound && index < lines.length);
    return value;
}