import os from 'os';
import { Router, Request, Response } from "express";

import { githubUsersHandler } from './github-users-handler';
import { loginHandler } from './login-handler';
import { deleteRedisCache, getRedisCache, postRedisCache } from './redis-handler';
import { downloadHandler, fileDeleteHandler, filesListHandler, uploadHandler } from './upload-handler';
import { accessSync, existsSync, readFileSync, unlinkSync } from 'fs';
import { getIPV4 } from '../utility/consul';
import { addBookmark, deleteBookmark, getBookmark, getBookmarks, updateBookmark } from './bookmark';
import { getSetting } from '../models/settings';
import { getAuthors } from '../database/author';
import { getUsers } from '../database/user';
import { createPost, deletePost, getPosts, updatePost } from '../database/post';
import { getPost, updatePostContent } from '../controllers/post';
import { getTokenPayload } from '../controllers/token';
import { getTasks } from '../database/task';
import { ServiceApp } from '@phantom-chen/cloud77';

function healthHandler(req: Request, res: Response) {
    res.send('Healthy');
}

const route = Router();
const setting = getSetting();
route.get('/service', (req: Request, res: Response) => {
    const version = existsSync('version') ? readFileSync('version').toString().trim() : '1.0.0';
    const data: ServiceApp = {
        name: setting.service,
        tags: setting.tags.split(","),
        hostname: os.hostname(),
        version,
        ip: getIPV4()
    }
    res.status(200).json(data);
})
route.get('/health', healthHandler)
route.get('/login', loginHandler)

// authorized

route.get('/github-users', githubUsersHandler)
route.get('/authors', async (req: Request, res: Response) => {
    const authors = await getAuthors();
    res.status(200).json(authors);
})
route.get('/users', async (req: Request, res: Response) => {
    const users = await getUsers(Number(req.query['index']), Number(req.query['size']));
    res.status(200).json(users);
});
route.get('/caches/:key', getRedisCache);
route.post('/caches', postRedisCache);
route.delete('/caches/:key', deleteRedisCache)

route.get("/files/downloads", downloadHandler);
route.get("/files", filesListHandler);
route.post("/files", uploadHandler);
route.delete("/files", fileDeleteHandler);

route.post("/posts", async (req: Request, res: Response) => {
    const { email, title, description } = req.body;
    const id = await createPost(email, title, description);
    updatePostContent(id, ''); 
    getPost(id);
    res.setHeader('X-New-Policy', 'Success');
    res.status(201).json({
        code: 'user-post-created',
        id,
        message: 'xxx'
    });
});

route.put("/posts/:id", async (req: Request, res: Response) => {
    const id = req.params['id'] || '';

    if ((typeof req.body) === 'string') {
        updatePostContent(id, req.body);
    } else {
        const { title, description } = req.body;
        const ack = await updatePost(id, title, description);
    }

    res.json({
        code: 'user-post-updated',
        id: '',
        message: 'ok'
    });
});

route.get('/tasks', async (req: Request, res: Response) => {
    const payload = getTokenPayload(req.headers['authorization']);
    console.log(Number(req.query['size']));
    const tasks = await getTasks(payload?.email || '');
    res.status(200).json(tasks);
});

route.get('/posts', async (req: Request, res: Response) => {
    const email = String(req.query['email']) || '';
    const posts = await getPosts(email);
    res.status(200).json({
        email,
        query: "",
        index: 0,
        size: 3,
        total: 10,
        data: posts
    });
});

route.get('/posts/:id', async (req: Request, res: Response) => {
    const content = getPost(req.params["id"]);
    res.send(content);
});


route.delete("/posts/:id", async (req: Request, res: Response) => {
    const id = req.params["id"];
    if (existsSync(`./data/posts/${id}`)) {
        accessSync(`./data/posts/${id}`);
        unlinkSync(`./data/posts/${id}`);
    }
    const ack = await deletePost(id);
    res.status(200).json({
        code: 'user-post-deleted',
        id: '',
        message: 'xx'
    });
});

route.get('/bookmarks', getBookmarks);
route.get("/bookmarks/:id", getBookmark);
route.post("/bookmarks", addBookmark);
route.put("/bookmarks/:id", updateBookmark);
route.delete("/bookmarks/:id", deleteBookmark)

export default route;
