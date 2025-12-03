import { Request, Response } from 'express';

export function getAccounts(req: Request, res: Response) {
    res.json({ agent: 'Service Agent', version: '1.0.0' });
}

export function getAccount(req: Request, res: Response) {
    res.json({ agent: 'Service Agent', version: '1.0.0' });
}