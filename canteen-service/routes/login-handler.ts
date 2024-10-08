import { Request, Response } from "express";
import { issueToken, validatePassword } from "../controllers/token";
import { getUser } from "../database/user";

export async function loginHandler(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await getUser(email);

    if (validatePassword(user, password)) {
        res.status(200).json(issueToken({ email: user?.Email || '', role: user?.Role || ''}))  
    } else {
        res.status(401).send("unauthorized");
    }

}