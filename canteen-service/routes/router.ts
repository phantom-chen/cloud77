import { Router, Response, Request } from "express";
import { createDocument, deleteDocument, getDocuments, updateDocument } from "./documents";
import { getRooms, createRoom } from "./rooms";
import { getGitHubUser } from "./github";
import { deleteFile, downloadFile, getUploads, uploadFile } from "./uploads";
import { getServiceAgent } from "./agent";
import { getBookmarks } from "./bookmarks";
import { getUser } from "./users";
import { issueToken } from "./tokens";
import { getAccounts, getAccount } from "./accounts";
import { getTasks } from "./tasks";
import { createPost, deletePost, getPostContent, getPosts, updatePost, updatePostContent } from "./posts";
import { pingCache, getCache, createCache, deleteCache } from "./caches";

const router = Router();

router.get('/status', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/agent', getServiceAgent);

router.get('/github-users', getGitHubUser)

router.get('/bookmarks', getBookmarks);

router.get('/documents', getDocuments);
router.post('/documents', createDocument);
router.put('/documents', updateDocument);
router.delete('/documents', deleteDocument);

router.get('/rooms', getRooms);
router.post('/rooms', createRoom);

router.get('/uploads', getUploads);
router.post('/uploads', uploadFile);
router.delete('/uploads/:name', deleteFile);
router.get('/uploads/:name', downloadFile);

router.get('/caches', pingCache);    // ping redis server
router.get('/caches/:key', getCache); // get cache by key
router.post('/caches', createCache);   // set cache key-value pair
router.delete('/caches/:key', deleteCache); // delete cache by key

router.get('/users', getUser);

router.post('/tokens', issueToken);

router.get('/accounts', getAccounts);
router.get('/accounts/:email', getAccount);

router.get('/posts', getPosts);
router.get('/posts/:id', getPostContent);
router.put('/posts/:id', updatePostContent);
router.put('/posts', updatePost);
router.post('/posts', createPost);
router.delete('/posts/:id', deletePost);

router.get('/tasks', getTasks);

export default router;