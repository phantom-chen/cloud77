import { Request, Response } from 'express';

export function getAuthors(req: Request, res: Response) {
    res.json({ agent: 'Service Agent', version: '1.0.0' });
}