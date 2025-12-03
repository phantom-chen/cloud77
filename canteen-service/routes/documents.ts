import { Request, Response } from "express";

export function getDocuments(req: Request, res: Response) {
    res.json({ documents: ['doc1', 'doc2', 'doc3'] });
}

export function getDocument(req: Request, res: Response) {
    res.json({ document: 'doc1' });
}

export function createDocument(req: Request, res: Response) {
    res.json({ message: 'Document created' });
}

export function deleteDocument(req: Request, res: Response) {
    res.json({ message: 'Document deleted' });
}

export function updateDocument(req: Request, res: Response) {
    res.json({ message: 'Document updated' });
}
