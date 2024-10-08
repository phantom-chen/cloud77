import { MongoClient, ServerApiVersion } from "mongodb";

export const DatabaseName = "Cloud77";

export function getClient(): MongoClient {
    return new MongoClient(
        process.env.MONGOSERVERURL || '',
        process.env.MONGOSERVERURL?.startsWith("mongodb+src") ?
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