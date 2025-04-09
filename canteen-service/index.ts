import express from 'express';
import * as dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';

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

    socket.emit('session-id', { id: socket.id });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
io.listen(server);
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});