import { createClient, RedisClientType } from "redis";
import { getSetting } from "../models/settings";

let client: RedisClientType;

async function getClient(): Promise<RedisClientType> {
    if (client) {
        return client;
    }
    try {
        const setting = getSetting();
        const { host, password, port} = setting.redis;
        client = await createClient({
            socket: {
                host: host,
                port: Number(port)
            },
            password: password
        });
        await client.connect();
        await client.ping();

        return client;
    } catch (error) {
        console.warn("fail to connect with redis");
        throw new Error();
    }
}

export async function addCache(cache: { key: string, value: string, expireInHour: number }): Promise<void> {
    const c = await getClient();
    await c.setEx(cache.key, cache.expireInHour * 60 * 60, cache.value);
}

export async function getCache(key: string): Promise<string | undefined> {
    const c = await getClient();
    const value = await c.get(key);
    return value ?? undefined;
}

export async function deleteCache(key: string): Promise<void> {
    const c = await getClient();
    await c.del(key);
}