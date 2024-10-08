import { Document, ObjectId } from "mongodb";
import { DatabaseName, getClient } from "./client";

const Posts = "Posts";

export interface MongoPost extends Document {
    Title: string,
    Email: string,
    Description: string,
}

export interface Post {
    id: string,
    title: string,
    description: string,
}

export async function getPosts(email:string): Promise<Post[]> {
    const client = getClient();
    await client.connect();

    const db = client.db(DatabaseName);
    const posts = await db.collection<MongoPost>(Posts).find({ Email: email }).toArray();    
    await client.close();
    return posts.map(p => {
        return { id: p._id.toString(), title: p.Title, description: p.Description};
    });
}

export async function createPost(email: string, title: string, description: string): Promise<string> {
    const client = getClient();
    await client.connect();

    const db = client.db(DatabaseName);
    const doc: MongoPost = {
        Email: email,
        Title: title,
        Description: description
    }
    const result = await db.collection<MongoPost>(Posts).insertOne(doc);
    await client.close();
    return result.insertedId.toString();
}

export async function deletePost(id:string): Promise<boolean> {
    const client = getClient();
    await client.connect();

    const db = client.db(DatabaseName);
    const result = await db.collection<MongoPost>(Posts).deleteOne({ _id: new ObjectId(id)} );
    await client.close();
    return result.acknowledged;
}

export async function updatePost(id: string, title: string | undefined, description: string | undefined): Promise<boolean> {
    const client = getClient();
    await client.connect();

    const db = client.db(DatabaseName);
    const result = await db.collection<MongoPost>(Posts).updateOne({ _id: new ObjectId(id)}, { $set: { Title: title, Description: description }});
    await client.close();
    return result.acknowledged;
}