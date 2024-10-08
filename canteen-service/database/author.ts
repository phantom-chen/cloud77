import { Document, ObjectId } from "mongodb";
import { DatabaseName, getClient } from "./client";

const Authors = "Authors";

export interface AuthorEntity extends Document {
    Name: string
    Title: string
    Region: string
    Address: string
    CreatedAt: Date,
    UpdatedAt: Date
}

export interface Author {
    id: string,
    name: string,
    title: string,
    region: string,
    address: string,
}

export async function getAuthors(): Promise<Author[]> {
    const client = await getClient();
    const collection = client.db(DatabaseName).collection<AuthorEntity>(Authors);
    const authors = await collection.find().toArray();
    await client.close();
    return authors.map(a => {
        return {
            id: a._id.toString(),
            name: a.Name,
            title: a.Title,
            region: a.Region,
            address: a.Address
        };
    });
}