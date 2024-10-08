import { Document, ObjectId } from "mongodb";
import { DatabaseName, getClient } from "./client";

const Bookmarks = "Bookmarks";

export interface MongoBookmark extends Document {
    Collection: string,
    Tags: string,
    Title: string,
    Href: string
}

export interface Bookmark {
    id: string,
    collection: string,
    tags: string,
    title: string,
    href: string
}

export async function getBookmarks(index: number, size: number): Promise<Bookmark[]> {
    const client = getClient();
    await client.connect();

    const db = client.db(DatabaseName);
    const items = await db.collection<MongoBookmark>(Bookmarks).find().skip(index * size).limit(size).toArray();
    await client.close();
    
    return Promise.resolve(items.map(i => {
        return {
            id: i._id.toString(),
            title: i.Title,
            href: i.Href,
            tags: i.Tags,
            collection: i.Collection
        }
    }))

    // const count = (await db.collection<MongoBookmark>('Bookmarks').countDocuments());
    // if (count === 0) {
    //     const documents: MongoBookmark[] = marks.map(m => {
    //         const obj: MongoBookmark = {
    //             Href: m.href,
    //             Title: m.title,
    //             Collection: m.collection,
    //             Tags: m.tags
    //         }
    //         return obj;
    //     })

    //     const result = (await db.collection<MongoBookmark>('Bookmarks').insertMany(documents)).acknowledged;
    //     if (result) {
    //         console.log('succeed inserting bookmarks');
    //     }
    // }
}

export async function createBookmark(bookmark: Bookmark): Promise<string> {
    const client = getClient();
    await client.connect();


    const db = client.db(DatabaseName);
    const doc: MongoBookmark = {
        Title: bookmark.title,
        Href: bookmark.href,
        Tags: bookmark.tags,
        Collection: bookmark.collection
    };
    const result = await db.collection<MongoBookmark>(Bookmarks).insertOne(doc);
    await client.close();

    return result.insertedId.toString();
}

export async function getBookmark(id: string): Promise<Bookmark> {
    const client = getClient();
    await client.connect();


    const db = client.db(DatabaseName);
    const result = await db.collection<MongoBookmark>(Bookmarks).findOne({_id: new ObjectId(id)});
    await client.close();

    return {
        id: result?._id.toString() || '',
        title: result?.Title || '',
        href: result?.Href || '',
        collection: result?.Collection || '',
        tags: result?.Tags || ''
    };
}

export async function updateBookmark(id: string, bookmark: Bookmark): Promise<boolean> {
    const client = getClient();
    await client.connect();

    const db = client.db(DatabaseName);
    const result = await db.collection<MongoBookmark>(Bookmarks).updateOne({ _id: new ObjectId(id)}, { $set: { Title: bookmark.title, Href: bookmark.href, Tags: bookmark.tags, Collection: bookmark.collection }});

    await client.close();
    return result.acknowledged;
}

export async function deleteBookmark(id: string): Promise<boolean> {
    const client = getClient();
    await client.connect();


    const db = client.db(DatabaseName);
    const result = await db.collection<MongoBookmark>(Bookmarks).deleteOne({ _id: new ObjectId(id)});

    await client.close();
    return result.acknowledged;
}