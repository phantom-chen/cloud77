import { Request, Response } from 'express';

export function getAccounts(req: Request, res: Response) {
    console.log(Number(req.query['index']));
    console.log(Number(req.query['size']));
    res.json({ agent: 'Service Agent', version: '1.0.0.0' });
}

export function getAccount(req: Request, res: Response) {
    res.json({ agent: 'Service Agent', version: '1.0.0.0' });
}