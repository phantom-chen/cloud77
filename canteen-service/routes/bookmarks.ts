import { Request, Response } from 'express';
import * as database from '../models/database/bookmark';
import { createMongoClient } from '../models/database/client';
import { getSettings } from '../models/settings';

export async function getBookmarks(req: Request, res: Response) {
    const index = Number(req.query['index'] ?? 0);
    const size = Number(req.query['size'] ?? 3);
    console.log(`Get bookmarks called with index=${index}, size=${size}`);
    const client = await createMongoClient();
    const dbName = getSettings().database;
    const bookmarks = await database.getBookmarks(client, dbName);
    res.json({
        data: bookmarks.slice(index * size, (index + 1) * size),
        total: bookmarks.length,
        query: '',
        index: index,
        size: size
    });
}