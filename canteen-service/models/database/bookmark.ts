import { MongoClient, Document } from "mongodb";

const Bookmarks = "Bookmarks";

export interface BookmarkEntity extends Document {
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

export async function getBookmarks(client: MongoClient, database: string): Promise<BookmarkEntity[]> {
    await client.connect();
    const collection = client.db(database).collection<BookmarkEntity>(Bookmarks);
    const bookmarks = await collection.find().toArray();
    await client.close();
    return bookmarks;
    // return bookmarks.map(b => {
    //     return {
    //         id: b._id.toString(),
    //         collection: b.Collection,
    //         tags: b.Tags,
    //         title: b.Title,
    //         href: b.Href
    //     };
    // });
}