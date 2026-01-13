import { Request, Response } from 'express';
import { createMongoClient } from '../models/database/client';
import * as database from '../models/database/user';
import md5 from "md5";
import { getSettings } from '../models/settings';

export function validatePassword(password: string, hashedPassword: string): boolean {
    return md5(password).toUpperCase() === hashedPassword;
}

export async function issueToken(req: Request, res: Response) {
    console.log(req.body);
    const { email, password } = req.body;
    console.log(`Issuing token for email: ${email} with password: ${password}`);

    const client = await createMongoClient();
    const dbName = getSettings().database;
    const user = await database.getUser(client, dbName, email);
    console.log(`Retrieved user: ${JSON.stringify(user)}`);

    if (user && validatePassword(password, user.Password)) {
        res.json({ agent: 'Service Agent', version: '1.0.0.0' });
    } else {
        res.status(401).send('unauthorized');
    }
}