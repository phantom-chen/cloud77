import { Request, Response } from 'express';
import * as database from '../models/database';
import md5 from "md5";

export function validatePassword(password: string, hashedPassword: string): boolean {
    return md5(password).toUpperCase() === hashedPassword;
}

export async function issueToken(req: Request, res: Response) {
    console.log(req.body);
    const { email, password } = req.body;
    console.log(`Issuing token for email: ${email} with password: ${password}`);

    const user = await database.getUser(email);
    console.log(`Retrieved user: ${JSON.stringify(user)}`);

    if (user && validatePassword(password, user.hashedPassword)) {
        res.json({ agent: 'Service Agent', version: '1.0.0' });
    } else {
        res.status(401).send('unauthorized');
    }
}