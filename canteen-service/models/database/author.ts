import { MongoClient, Document } from "mongodb";

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

const Authors = "Authors";

export async function getAuthors(client: MongoClient, database: string): Promise<AuthorEntity[]> {
    const collection = client.db(database).collection<AuthorEntity>(Authors);
    const authors = await collection.find().toArray();
    await client.close();
    return authors;
    // return authors.map(a => {
    //     return {
    //         id: a._id.toString(),
    //         name: a.Name,
    //         title: a.Title,
    //         region: a.Region,
    //         address: a.Address
    //     };
    // });
}