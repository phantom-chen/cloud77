import { Request, Response } from 'express';

export function getTasks(req: Request, res: Response) {
    res.json({ agent: 'Service Agent', version: '1.0.0' });
}