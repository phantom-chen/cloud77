import { createClient, RedisClientType } from "redis";


function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function createCacheClient() {
    const client = await createClient({
        socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
        },
        password: process.env.REDIS_PASSWORD || undefined,
    })
        .on('error', (err) => console.log('Redis Client Error', err))
    return client;
}

export async function pingCacheServer(): Promise<string> {
    const client = await createCacheClient();
    await client.connect();
    const result = await client.ping();
    console.log('Connected to Redis server successfully.' + result);
    // await delay(1000); // wait for a moment
    await client.disconnect();
    return result;
}

export async function updateCache(key: string, value: string): Promise<void> {
    const client = await createCacheClient();
    await client.connect();
    // await client.set('canteen_test_key', 'canteen_test_value');
    await client.setEx(key, 60 * 5, value); // expires in 5 minutes
    await client.disconnect();
}

export async function getCache(key: string): Promise<string | null> {
    const client = await createCacheClient();
    await client.connect();
    const value = await client.get(key);
    await client.disconnect();
    return value;
}

export async function deleteCache(key: string) {
    const client = await createCacheClient();
    await client.connect();
    await client.del(key);
    await client.disconnect();
}