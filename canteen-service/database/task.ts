import { Document, ObjectId } from "mongodb";
import { DatabaseName, getClient } from "./client";

const Tasks = "Tasks";

export interface TaskEntity extends Document {
    Email: string,
    Title: string,
    Description: string,
    State: number
}

export async function getTasks(email:string) {
    const client = await getClient();
    const db = client.db(DatabaseName);
    const tasks = (await db.collection<TaskEntity>(Tasks).find({ Email: email }).toArray());
    await client.close();
    return tasks;
}