import express from 'express';
import * as dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import { randomUUID } from 'crypto';
import { generate } from 'randomstring';
import { appendConnection, connectedUsers, removeConnection, serverConnected, serverDisConnected } from './models/online';
import { generateID } from './models/id';
import { type } from 'os';
import { getUser, issueToken } from './models/user';

dotenv.config();
const PORT = process.env.PORT || '80';

const app = express();
const port = Number(PORT);

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/api/values', (req, res) => {
    res.json(['canteen service value1', 'canteen service value2', 'canteen service value3']);
});

const server = http.createServer(app);
const io = new Server(server);

if (process.env.SOCKETPATH) {
    io.path(process.env.SOCKETPATH);
}

io.on('connection', (socket) => {
    console.log('a user connected');
    console.log(socket.id);
    // socket.client.request.headers['x-user-name']
    // only assign session id to the user that is connected
    socket.emit('session-id', { id: socket.id });   // assign session id

    // session-token, issue the token and save in session storage

    appendConnection(socket.id);

    socket.emit("online", { online: serverConnected() });
    socket.broadcast.emit("online", { online: connectedUsers() });

    socket.on('update-user', (data: { username: string, password: string, token: string }) => {
        console.log(data.username, data.password);
        if (data.token) {
            socket.emit("update-user-response", { succeed: true, error: 'xxx', username: getUser(data.token), token: '' });
        } else {
            socket.emit("update-user-response", { succeed: true, error: 'xxx', username: '', token: issueToken(data.username) });
        }
        appendConnection(socket.id, data.username);
    })

    socket.on('join-room', (data: { token: string, room: string }) => {
        console.log(data);
        console.log(getUser(data.token));
    });

    socket.on('add-room', (data: { token: string, room: string }) => {
        console.log(data);
    });

    socket.on('remove-room', (data: { token: string, room: string }) => {
        console.log(data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        removeConnection(socket.id);
        socket.broadcast.emit("online", { online: serverDisConnected() });
    });
});

io.use((socket, next) => {
    console.log('socket middleware works');
    console.log(socket.client.request.headers['authorization']);
    console.log(socket.client.request.url);
    next();
});

io.listen(server);
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    // console.log(randomUUID());
    // console.log(generate(7));
    // console.log(generateID(6));
    console.log(type());
});