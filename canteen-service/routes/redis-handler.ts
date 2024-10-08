import { Request, Response } from "express";
import { addCache, deleteCache, getCache } from "../controllers/cache";

export async function getRedisCache(req: Request, res: Response) {
    const key = String(req.params['key']);
    if (!key) {
        res.status(400).json({
            code: 'empty-cache-key',
            id: '',
            message: 'invalid redis key'
        })
        return;
    }

    const value = await getCache(key);

    if (!value) {
        res.status(404).json({
            code: 'invalid-cache-key',
            id: '',
            message: `not find redis cache for ${key}`
        });
        return;
    }

    res.json({
        key,
        value
    });
}

export async function postRedisCache(req: Request, res: Response) {
    const { key, value } = req.body;
    await addCache({ key, value, expireInHour: 1 });

    res.status(200).json({
        code: 'cache-value-created',
        id: '',
        message: 'redis works'
    });
}

export async function deleteRedisCache(req: Request, res: Response) {
    const key = String(req.params['key']);
    if (!key) {
        res.status(400).json({
            code: 'empty-cache-key',
            id: '',
            message: 'invalid redis key'
        })
        return;
    }

    await deleteCache(key);

    res.json({
        code: 'cache-value-deleted',
        id: '',
        message: 'redis demo delete works'
    });
}
