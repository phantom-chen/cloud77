import { Document } from "mongodb";
import { DatabaseName, getClient } from "./client";

const Users = "Users";

export interface SimpleUser {
    email: string,
    role: string,
    profile: Profile
}

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

export async function getUsers(index: number, size: number): Promise<SimpleUser[]> {
    const client = getClient();
    await client.connect();
    const db = client.db(DatabaseName);
    const entities = await db.collection<UserEntity>(Users).find().skip(index * size).limit(size).toArray();
    await client.close();

    const users: SimpleUser[] = entities.map(e => {
        return {
            email: e.Email,
            role: e.Role || 'User',
            profile: e.Profile
        }
    });
    await client.close();
    return users;
}

export async function getUser(email: string): Promise<UserEntity | undefined> {
    const client = getClient();
    await client.connect();
    const db = client.db(DatabaseName);
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

export async function updateUserName(email: string, name: string): Promise<boolean> {
    const client = getClient();
    await client.connect();
    const db = client.db(DatabaseName);
    const collection = db.collection<UserEntity>(Users);
    const result = await collection.updateOne({ Email: email}, { $set: { Name: name }});
    await client.close();
    return result.acknowledged;
}

export async function updateUserPassword(email:string, hashedPassword:string) {
    const client = getClient();
    await client.connect();
    const db = client.db(DatabaseName);
    const collection = db.collection<UserEntity>(Users);
    const result = await collection.updateOne({ Email: email}, { $set: { Password: hashedPassword }});
    await client.close();
    return result.acknowledged;
}
