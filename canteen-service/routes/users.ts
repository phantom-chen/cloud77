import { Request, Response } from 'express';

export function getUser(req: Request, res: Response) {
    res.json({ agent: 'Service Agent', version: '1.0.0' });
}