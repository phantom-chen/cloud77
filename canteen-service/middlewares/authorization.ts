import { Request, Response, NextFunction } from "express";
import { AuthorizationError, getClaims } from "../models/token";

export const AuthorizationMiddleware = async (req:Request, res: Response, next: NextFunction) => {
    console.log("authorization middleware works");
    // await setTimeout(() => {
    //     console.log('set timeout')
    // }, 200);
    try {
        console.log(req.path);
        // consider some paths do not require authorization
        const unprotectedPaths = ['/bookmarks', '/authors', '/users', '/tokens'];
        if (!unprotectedPaths.includes(req.path)) {
            const authHeader = req.headers['authorization'] ?? '';
            if (authHeader.trim().split(' ').length === 1) {
                throw new AuthorizationError({ code: '999', message: 'invalid token pattern' });
            }
            getClaims(authHeader?.split(' ')[1] || '');
            // Here you can add your authorization logic
            // console.log(`Authorization header: ${req.headers['authorization']}`);
        }

        next();
    } catch (error){
        console.error('Authorization error:', error);
        if (error instanceof AuthorizationError) {
            // 401 or 403 based on your logic
            res.status(401).send({
                code: error.code,
                id: '',
                message: error.message
            });
        } else {
            res.status(500).send({
                code: 'internal-server-error',
                id: '',
                message: (error as Error).message
            });
        }
    }
}