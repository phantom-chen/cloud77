import { Request, Response } from 'express';
import * as database from '../models/database';

export async function getBookmarks(req: Request, res: Response) {
    const index = Number(req.query['index'] ?? 0);
    const size = Number(req.query['size'] ?? 3);
    console.log(`Get bookmarks called with index=${index}, size=${size}`);
    const bookmarks = await database.getBookmarks();
    res.json({
        data: bookmarks.slice(index * size, (index + 1) * size),
        total: bookmarks.length,
        query: '',
        index: index,
        size: size
    });
}