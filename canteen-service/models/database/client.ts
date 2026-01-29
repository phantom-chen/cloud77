import { MongoClient, ServerApiVersion } from "mongodb";

export function createMongoClient(): MongoClient {
    return new MongoClient(
        process.env.DB_CONNECTION || '',
        process.env.DB_CONNECTION?.startsWith("mongodb+") ?
            {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                }
            } : undefined);
}

export async function pingMongoServer(client: MongoClient, database: string): Promise<void> {
    await client.db(database).command({ ping: 1 });
} 