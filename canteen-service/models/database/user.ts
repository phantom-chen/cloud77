import { MongoClient, Document } from "mongodb";

const Users = "Users";

export interface Profile {
    Surname: string;
    GivenName: string;
    City: string;
    Phone: string;
    Company: string;
    CompanyType: string;
    Title: string;
    Contact: string;
    Fax: string;
    Post: string;
    Supplier: string;
}

export interface UserEntity extends Document {
    Name: string,
    Email: string
    Password: string
    Role: string,
    Confirmed?: boolean,
    Profile: Profile
}

export async function countUsers(client: MongoClient, database: string): Promise<number> {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection<UserEntity>(Users);
    const count = await collection.countDocuments();
    await client.close();
    return count;
}

export async function getUser(client: MongoClient, database: string, email: string): Promise<UserEntity | undefined> {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection<UserEntity>(Users);
    try {
        const entity = await collection.findOne({ Email: email });
        await client.close();
        return entity || undefined;
    } catch (error: any) {
        console.log(error)
        await client.close();
        return undefined;
    }
}

export async function getUsers(client: MongoClient, database: string, index: number, size: number): Promise<UserEntity[]> {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection<UserEntity>(Users);
    const users = await collection.find().skip(index * size).limit(size).toArray();
    await client.close();
    return users;
}

export async function updateUserName(client: MongoClient, database: string, email: string, name: string): Promise<boolean> {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection<UserEntity>(Users);
    const result = await collection.updateOne({ Email: email }, { $set: { Name: name } });
    await client.close();
    return result.acknowledged;
}

export async function updatePassword(client: MongoClient, database: string, email: string, hashedPassword: string): Promise<boolean> {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection<UserEntity>(Users);
    const result = await collection.updateOne({ Email: email }, { $set: { Password: hashedPassword } });
    await client.close();
    return result.acknowledged;
}