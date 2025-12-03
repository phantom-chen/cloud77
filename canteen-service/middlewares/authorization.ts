import { Request, Response, NextFunction } from "express";

export const AuthorizationMiddleware = async (req:Request, res: Response, next: NextFunction) => {
    console.log("demo middleware works");
    await setTimeout(() => {
        console.log('set timeout')
    }, 200);
    next();
}