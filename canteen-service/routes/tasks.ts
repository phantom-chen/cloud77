import { Request, Response } from 'express';
import * as database from '../models/database';
import { getClaims } from '../models/token';

export async function getTasks(req: Request, res: Response) {
    const authHeader = req.headers['authorization'];
    const email = getClaims(authHeader?.split(' ')[1] || '') ?? '';
    console.log(`Verified email: ${email}`);
    const tasks = await database.getTasks(email);
    console.log(`Retrieved ${tasks.length} tasks for email: ${email}`);
    console.log(tasks);
    res.json({ agent: 'Service Agent', version: '1.0.0' });
}