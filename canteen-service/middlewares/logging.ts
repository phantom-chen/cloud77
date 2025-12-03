import { Request, Response, NextFunction } from "express";

export const LoggingMiddleware = async (req:Request, res: Response, next: NextFunction) => {
    console.log("logging middleware works");
    await setTimeout(() => {
        console.log('set timeout')
    }, 200);
    next();
}