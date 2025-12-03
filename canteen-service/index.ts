import express from 'express';
import * as dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import fileUpload from "express-fileupload";

import { appendConnection, connectedUsers, removeConnection, serverConnected, serverDisConnected } from './models/online';
import { generateID } from './models/guid';
import { platform, type } from 'os';
import { getUser, issueToken } from './models/user';
import { addRoom, getRooms, IChatRoom, removeRoom } from './models/room';
import { appendLog } from './models/logging';
import router from './routes/router';
import { AccountPayload } from './models/live';
import { createDocument, getDocument, getDocuments } from './models/document';
import { rootData } from './models/local-data';
import { createMongoClient, pingMongoServer } from './models/database';
import { getSettings } from './models/settings';

dotenv.config();

const PORT = process.env.CANTEEN_SERVICE_PORT || '80';
console.log(`Canteen service port: ${PORT}`);
const app = express();
const port = Number(PORT);

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/api/values', (req, res) => {
    res.json(['canteen service value1', 'canteen service value2', 'canteen service value3']);
});

app.use('/api', router);
app.use(fileUpload);

const server = http.createServer(app);
const io = new Server(server);

if (process.env.CANTEEN_SERVICE_SOCKET_PATH) {
    console.log(`Canteen service socket path: ${process.env.CANTEEN_SERVICE_SOCKET_PATH}`);
    io.path(process.env.CANTEEN_SERVICE_SOCKET_PATH);
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

    // broadcast message to all sockets
    setImmediate(() => io.emit("broadcastToAll", `welcome socket ${socket.id}`));

    socket.on('msgToServer', (data: { account: AccountPayload, message: string }) => {
        console.log('message: ' + data.message);
        socket.emit("msgToClient", `received your message: ${data.message}`);
        // io.emit('msgToClient', msg); // broadcast to all clients including sender
    });

    // broadcast message to other sockets
    socket.on('msgToOthers', (data: { account: AccountPayload, message: string }) => {
        console.log('message to others: ' + data.message);
        socket.broadcast.emit('broadcastToOthers', data.message); // broadcast to all clients except sender
        io.emit('broadcastToOthers', data.message);
    });

    socket.on('update-user', (data: { username: string, password: string, token: string }) => {
        console.log(data.username, data.password);
        if (data.token) {
            socket.emit("update-user-response", { succeed: true, error: 'xxx', username: getUser(data.token), token: '' });
        } else {
            socket.emit("update-user-response", { succeed: true, error: 'xxx', username: '', token: issueToken(data.username) });
        }
        appendConnection(socket.id, data.username);
    })

    socket.on('create-user-request', (data: { user: string, email: string, password: string }) => {
        console.log(data);
    });

    socket.on("get-rooms-request", (data: { account: AccountPayload }) => {
        console.log(data);
        socket.emit("rooms", { rooms: getRooms() });
    });

    socket.on('join-room-request', (data: { account: AccountPayload, id: string }) => {
        console.log(data);
    });

    socket.on('leave-room-request', (data: { account: AccountPayload, id: string }) => {
        console.log(data);
    });

    socket.on('add-room-request', (data: { account: AccountPayload, room: IChatRoom }) => {
        addRoom({
            id: generateID(6),
            name: data.room.name,
            description: data.room.description,
            capacity: data.room.capacity,
            location: data.room.location,
            amenities: data.room.amenities,
            features: data.room.features,
            availability: data.room.availability
        });
        
        socket.emit("rooms", { rooms: getRooms() });
    });

    socket.on('remove-room-request', (data: { account: AccountPayload, id: string }) => {
        console.log(data);
        socket.emit("rooms", { rooms: getRooms() });
    });

    socket.on("get-documents-request", (data: { account: AccountPayload }) => {
        console.log(data);
        socket.emit("documents", { documents: getDocuments() });
    });

    socket.on("get-document-request", (data: { account: AccountPayload, id: string }) => {
        console.log(data);
        getDocument(data.id);
        socket.emit("document", { id: "", title: "not implemented", content: "" });
    });

    socket.on('create-document-request', (data: { account: AccountPayload, title: string }) => {
        console.log(data);
        createDocument(generateID(6), data.title);
        socket.emit("documents", { documents: getDocuments() });
    });

    socket.on('remove-document-request', (data: { account: AccountPayload, id: string }) => {
        console.log(data);
        socket.emit("documents", { documents: getDocuments() });
    });

    socket.on('update-document-title-request', (data: { account: AccountPayload, id: string, title: string }) => {
        console.log(data);
        socket.emit("documents", { documents: getDocuments() });
    });

    socket.on('update-document-content-request', (data: { account: AccountPayload, id: string, content: string }) => {
        console.log(data);
        socket.emit("documents", { documents: getDocuments() });
    });

    socket.on('get-profile-request', (data: { account: AccountPayload }) => {
        console.log(data);
        console.log(socket.client.request.headers['authorization']);
        console.log(socket.client.request.url);
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
    console.log(`Server is running at Port ${port}`);
    console.log(process.env.CUSTOM_LOGGING);
    console.log(process.env.DB_CONNECTION);
    console.log(platform());
    console.log(type());
    console.log(rootData());
    console.log(getSettings().database);
    appendLog('Canteen service starts', 'warning');
    
    pingMongoServer(createMongoClient(), 'tester')
    .then(() => {
        console.log('MongoDB server is reachable.');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB server:', err);
    });

    if (type() === 'Linux') {
        setInterval(() => {
            appendLog('Canteen service heartbeat', 'info');
        }, 1000 * 30); // every 30 seconds
    }
});