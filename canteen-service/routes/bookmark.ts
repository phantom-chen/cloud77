import { Request, Response } from "express";
import * as db from '../database/bookmark'
import { BookmarkResult } from "@phantom-chen/cloud77";

export async function getBookmarks(req: Request, res: Response) {
    const bookmarks = await db.getBookmarks(Number(req.query['index']), Number(req.query['size']));
    const data: BookmarkResult = {
        query: '',
        index: 0,
        size: 10,
        total: 10,
        data: bookmarks
    }
    res.status(200).json(data);
}

export async function getBookmark(req: Request, res: Response) {
    const result = await db.getBookmark(req.params["id"]);
    res.status(200).json(result);
}

export async function addBookmark(req: Request, res: Response) {
    const bookmark: db.Bookmark = req.body;
    const id = await db.createBookmark(bookmark);
    res.setHeader('X-New-Policy', 'Success');
    res.status(201).json({
        code: 'bookmark-created',
        id,
        message: 'xxx'
    });
}

export async function updateBookmark(req: Request, res: Response) {
    const bookmark: db.Bookmark = req.body;
    const result = await db.updateBookmark(req.params["id"], bookmark);
    res.status(200).json({
        code: 'bookmark-updated',
        id: '',
        message: 'xxx'
    });
}

export async function deleteBookmark(req: Request, res: Response) {
    const result = await db.deleteBookmark(req.params["id"]);
    res.status(200).json({
        code: 'bookmark-deleted',
        id: '',
        message: 'xxx'
    });
}