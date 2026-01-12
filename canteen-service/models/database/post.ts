import { Document, MongoClient, ObjectId } from "mongodb";

const Posts = "Posts";

export interface PostEntity extends Document {
    Title: string,
    Email: string,
    Description: string,
}

export interface Post {
    id: string,
    title: string,
    description: string,
}

export async function getPosts(client: MongoClient, database: string, email: string): Promise<PostEntity[]> {
    await client.connect();
    const db = client.db(database);
    const posts = await db.collection<PostEntity>(Posts).find({ Email: email }).toArray();
    await client.close();
    return posts;
    // return posts.map(p => {
    //     return { id: p._id.toString(), title: p.Title, description: p.Description};
    // });
}

export async function countPosts(client: MongoClient, database: string): Promise<number> {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection<PostEntity>(Posts);
    const count = await collection.countDocuments();
    await client.close();
    return count;
}

export async function createPost(client: MongoClient, database: string, email: string, post: Post): Promise<string> {
    await client.connect();
    const db = client.db(database);
    const doc: PostEntity = {
        Email: email,
        Title: post.title,
        Description: post.description
    }
    const result = await db.collection<PostEntity>(Posts).insertOne(doc);
    await client.close();
    return result.insertedId.toString();
}

export async function createPosts(client: MongoClient, database: string, email: string, posts: Post[]) {
    await client.connect();
    const db = client.db(database);
    const docs: PostEntity[] = [];
    for (const post of posts) {
        const doc: PostEntity = {
            Email: email,
            Title: post.title,
            Description: post.description
        }
        docs.push(doc);
    }
    const result = await db.collection<PostEntity>(Posts).insertMany(docs);
    await client.close();

    const ids: string[] = [];
    for (const key in result.insertedIds) {
        ids.push(result.insertedIds[key].toString());
    }
    return ids;
}

export async function updatePost(client: MongoClient, database: string, post: Post): Promise<boolean> {
    await client.connect();
    const db = client.db(database);
    const result = await db.collection<PostEntity>(Posts).updateOne({
        _id: new ObjectId(post.id)
    }, {
        $set: {
            Title: post.title,
            Description: post.description
        }
    });
    await client.close();
    return result.acknowledged;
}

export async function deletePost(client: MongoClient, database: string, id: string): Promise<boolean> {
    await client.connect();
    const db = client.db(database);
    const result = await db.collection<PostEntity>(Posts).deleteOne({ _id: new ObjectId(id) });
    await client.close();
    return result.acknowledged;
}