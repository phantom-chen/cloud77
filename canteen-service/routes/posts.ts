import { Request, Response } from 'express';
import * as database from '../models/database/post';
import { createMongoClient } from '../models/database/client';
import { getSettings } from '../models/settings';

export function getPosts(req: Request, res: Response) {
    res.json({ agent: 'Service Agent', version: '1.0.0.0' });
}

export function getPostContent(req: Request, res: Response) {
    console.log(`Fetching content for post ID: ${req.params.id}`);
    res.send('Post content here');
}

export function updatePostContent(req: Request, res: Response) {
    console.log(`Updating content for post ID: ${req.params.id}`);
    console.log(typeof req.body);
    console.log('New content:', req.body);
    res.json({ agent: 'Service Agent', version: '1.0.0.0' });
}

export async function createPost(req: Request, res: Response) {
    const client = await createMongoClient();
    const dbName = getSettings().database;
    const post: database.Post = req.body;
    // get email from auth token in real implementation
    const newPostId = await database.createPost(client, dbName, '', post);
    res.setHeader('X-Post-Id', newPostId);
        res.status(201).json({
        code: 'post-created',
        id: newPostId,
        message: 'xxx'
    });
}

export async function updatePost(req: Request, res: Response) {
    const client = await createMongoClient();
    const dbName = getSettings().database;
    const post: database.Post = req.body;
    await database.updatePost(client, dbName, post);
    res.json({ agent: 'Service Agent', version: '1.0.0.0' });
}

export async function deletePost(req: Request, res: Response) {
    console.log(`Deleting post with ID: ${req.params.id}`);
    const client = await createMongoClient();
    const dbName = getSettings().database;
    await database.deletePost(client, dbName, req.params.id);
    res.json({ agent: 'Service Agent', version: '1.0.0.0' });
}