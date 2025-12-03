import { MongoClient, ServerApiVersion, Document, ObjectId } from "mongodb";
import { getSettings } from "./settings";

export function createMongoClient(): MongoClient {
    console.log("Creating MongoDB client...");
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

export async function getAuthors(): Promise<Author[]> {
    const client = await createMongoClient();
    const collection = client.db(getSettings().database).collection<AuthorEntity>(Authors);
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

const Tasks = "Tasks";

export interface TaskEntity extends Document {
    Email: string,
    Title: string,
    Description: string,
    State: number
}

export async function getTasks(email:string) {
    const client = await createMongoClient();
    const db = client.db(getSettings().database);
    const tasks = (await db.collection<TaskEntity>(Tasks).find({ Email: email }).toArray());
    await client.close();
    return tasks;
}

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

export async function getUser(email: string): Promise<UserEntity | undefined> {
    const client = createMongoClient();
    await client.connect();
    const db = client.db(getSettings().database);
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