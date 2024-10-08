import { readFileSync, existsSync } from "fs";

export interface TokenSetting {
    issuer: string,
    audience: string,
    secret: string,
    expiresInHour: number
}

export interface MysqlSetting {
    host: string,
    username: string,
    password: string,
    database: string
}

export interface RedisSetting {
    host: string,
    port: string,
    password: string,
}

export interface QueueSetting {
    host: string,
    username: string,
    password: string
}

export interface ServiceSetting {
    service: string,
    tags: string,
    local: string,
    token: TokenSetting,
    mysql: MysqlSetting,
    redis: RedisSetting,
    queue: QueueSetting
}

export function getSetting(): ServiceSetting {
    let file = "appsettings.json";  
    if (existsSync("appsettings.development.json")) {
        file = "appsettings.development.json";
    }
    if (existsSync("appsettings.production.json")) {
        file = "appsettings.production.json";
    }

    const rawData = readFileSync(file, 'utf-8');
    const jsonData = JSON.parse(rawData) as ServiceSetting;
    return jsonData;
}

export function getQueueConnection(): string {
    const setting = getSetting();
    return `amqp://${setting.queue.username}:${setting.queue.password}@${setting.queue.host}`
}
