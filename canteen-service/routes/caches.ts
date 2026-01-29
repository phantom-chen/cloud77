import { Request, Response } from 'express';
import * as cache from '../models/cache';

export async function pingCache(req: Request, res: Response) {
    const result = await cache.pingCacheServer();
    res.json({ result });
}

export async function getCache(req: Request, res: Response) {
    console.log(req.params.key);
    const key = String(req.params.key);
    if (!key) {
        res.status(400).json({
            code: 'empty-cache-key',
            id: '',
            message: 'invalid redis key'
        })
        return;
    }

    const value = await cache.getCache(key);
    
    if (value === null) {
        res.status(404).json({
            code: 'cache-key-not-found',
            id: '',
            message: 'cache key not found'
        });
        return;
    }

    res.json({
        key,
        value
    });
}

export async function createCache(req: Request, res: Response) {
    const { key, value } = req.body;
    if (!key || !value) {
        res.status(400).json({
            code: 'invalid-cache-payload',
            id: '',
            message: 'invalid cache payload'
        });
        return;
    }
    await cache.updateCache(key, value);
    res.status(200).json({
        code: 'cache-value-created',
        id: '',
        message: 'cache value created successfully'
    });
}

export async function deleteCache(req: Request, res: Response) {
    console.log(req.params.key);
    const key = String(req.params.key);
    if (!key) {
        res.status(400).json({
            code: 'empty-cache-key',
            id: '',
            message: 'invalid redis key'
        })
        return;
    }
    await cache.deleteCache(key);
    res.status(200).json({
        code: 'cache-key-deleted',
        id: '',
        message: 'cache key deleted successfully'
    });
}