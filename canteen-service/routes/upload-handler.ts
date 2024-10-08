import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import { accessSync, existsSync, mkdir, unlinkSync } from "fs";
import { getFiles } from "../utility";
import { getUser } from "../database/user";

export async function uploadHandler(req: Request, res: Response) {
    const email = String(req.query['email']);
    const user =  await getUser(email);
    if (!user) {
        res.status(404).json({
            code: 'empty-user-entity',
            id: '',
            message: 'xxx'
        });
        return;
    }
    const userId = user._id.toString();
    if (req.files) {
        const files = req.files as fileUpload.FileArray;
        const file = files.file as fileUpload.UploadedFile;
        if (file) {
            if (!existsSync(`uploads/${userId}/`)) {
                mkdir(`uploads/${userId}/`, err => {
                    console.log(err);
                })
            }

            if (existsSync(`uploads/${userId}/` + file.name)) {
                res.status(400).json({ code: 'invalid-user-file', id: '', message: 'file exists'});
                return;
            }

            file.mv(`uploads/${userId}/` + file.name, (err) => {
                if (err) {
                    res.status(500).json({ code: 'update-file-error', id: '', message: "fail to save file"});
                } else {
                    res.status(200).json({ code: 'user-file-created', id: '', message: "receive file" });
                }
            })
        } else {
            res.status(400).json({ code: 'empty-file', id: '', message: "not receive file" });
        }

    } else {
        res.status(400).json({ code: 'empty-file', id: '', message: "bad request"})
    }
}

export async function downloadHandler(req: Request, res: Response) {
    const email = String(req.query['email']);
    const user = await getUser(email);
    if (!user) {
        res.status(400).json({
            code: 'empty-user-entity',
            id: '',
            message: 'xxx'
        });
        return;
    }
    const userId = user._id.toString();

    const name = req.query['file'];
    if (existsSync(`uploads/${userId}/${name}`)) {
        res.download(`uploads/${userId}/${name}`);
    } else {
        res.status(400).json({ code: 'invalid-user-file', id: '', message: "not found file"});
    }
}

export async function filesListHandler(req: Request, res: Response) {
    const email = String(req.query['email']);
    const user = await getUser(email);
    if (!user) {
        res.status(400).json({
            code: 'empty-user-entity',
            id: '',
            message: 'xxx'
        });
        return;
    }
    const userId = user._id.toString();

    if (existsSync(`uploads/${userId}`)) {
        const files = await getFiles(`uploads/${userId}`)
        if (files.length === 0) {
            res.status(400).json({ code: 'empty-user-file', id: '', message: "not found files"});
        } else {
            res.json({
                email,
                index: 0,
                size: 0,
                total: 0,
                query: '',
                data: files.map(f => f.replace(`uploads\\${userId}\\`, '').replace(`uploads//${userId}//`, ''))
            });
        }
    } else {
        res.status(400).json({ code: 'empty-user-file', id: '', message: "not found files"});
    }
}

export async function fileDeleteHandler(req: Request, res: Response) {
    const email = String(req.query['email']);
    const file = String(req.query['file']);
    const user = await getUser(email);
    if (!user) {
        res.status(400).json({
            code: 'empty-user-entity',
            id: '',
            message: 'xxx'
        });
        return;
    }
    const userId = user._id.toString();
    if (existsSync(`uploads/${userId}/${file}`)) {
        accessSync(`uploads/${userId}/${file}`);
        unlinkSync(`uploads/${userId}/${file}`);
        res.status(200).json({
            code: 'user-file-deleted',
            id: '',
            message: 'xxx'
        });
    } else {
        res.status(400).json({
            code: 'empty-user-file',
            id: '',
            message: 'xxx'
        });
    }
}