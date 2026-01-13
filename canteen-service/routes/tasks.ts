import { Request, Response } from 'express';
import { createMongoClient } from '../models/database/client';
import * as database from '../models/database/task';
import { getClaims } from '../models/token';
import { getSettings } from '../models/settings';

export async function getTasks(req: Request, res: Response) {
    const authHeader = req.headers['authorization'];
    const email = getClaims(authHeader?.split(' ')[1] || '') ?? '';
    console.log(`Verified email: ${email}`);
    const client = await createMongoClient();
    const dbName = getSettings().database;
    const tasks = await database.getTasks(client, dbName, email);
    console.log(`Retrieved ${tasks.length} tasks for email: ${email}`);
    console.log(tasks);
    res.json({ agent: 'Service Agent', version: '1.0.0.0' });
}