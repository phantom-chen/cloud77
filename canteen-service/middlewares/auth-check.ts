import { Request, Response, NextFunction } from "express";
import { getTokenPayload } from "../controllers/token";
import { AuthorizationError } from "../controllers/error";

export const AuthCheck = (req:Request, res: Response, next: NextFunction) => {
    try {
        const path = req.path;
        const ignore = path.startsWith('/health') || path.startsWith('/service') || path.startsWith('/login');
        if (!ignore) {
            getTokenPayload(req.headers['authorization']);
        }

        next();
    } catch (error) {
        console.log(error);
        if (error instanceof AuthorizationError) {
            res.status(401).send({
                error: {
                    code: error.code,
                    message: error.message
                }
            })
        } else {
            res.status(500).send({
                error: {
                    status: 500,
                    message: 'todo'
                }
            })
        }   
    }
}