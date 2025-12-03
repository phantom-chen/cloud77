import { Router, Response, Request } from "express";
import { createDocument, deleteDocument, getDocuments, updateDocument } from "./documents";
import { getRooms, createRoom } from "./rooms";
import { getGitHubUser } from "./github";
import { getUploads, uploadFile } from "./uploads";

const router = Router();

router.get('/status', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/github-users', getGitHubUser)

router.get('/documents', getDocuments);
router.post('/documents', createDocument);
router.put('/documents', updateDocument);
router.delete('/documents', deleteDocument);

router.get('/rooms', getRooms);
router.post('/rooms', createRoom);

router.get('/uploads', getUploads);
router.post('/uploads', uploadFile);

export default router;