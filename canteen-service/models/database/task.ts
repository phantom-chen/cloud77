import { MongoClient, Document } from "mongodb";

const Tasks = "Tasks";

export interface TaskEntity extends Document {
    Email: string,
    Title: string,
    Description: string,
    State: number
}

export async function getTasks(client: MongoClient, database: string, email: string) {
    await client.connect();
    const db = client.db(database);
    const tasks = (await db.collection<TaskEntity>(Tasks).find({ Email: email }).toArray());
    await client.close();
    return tasks;
}
