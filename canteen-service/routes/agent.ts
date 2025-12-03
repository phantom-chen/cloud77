import { Request, Response } from 'express';

export function getServiceAgent(req: Request, res: Response) {
    res.json({ agent: 'Service Agent', version: '1.0.0' });
}