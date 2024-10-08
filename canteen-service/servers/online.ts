import { Server, Socket } from 'socket.io';
import { getTokenPayload, issueToken, validatePassword } from '../controllers/token';
import { addRoom, addUser, getRooms, joinRoom, removeRoom } from '../controllers/chat-room';
import { getPost, getPostList, savePost } from '../controllers/post';
import { deletePost } from '../database/post';
import { getUser } from '../database/user';

let count = 0;

export function runChatServer(port: number) {
    const server = new Server({
        path: process.env.SOCKETPATH
    });

    server.on("connection", function (socket: Socket) {
        
        let joinedRoom = '';

        count++;

        socket.emit('session-id', { id: socket.id });

        // to all clients
        server.emit("online", { online: count });

        socket.on("disconnect", function() {
            count--;
            socket.broadcast.emit("online", { online: count });
        });

        socket.emit("get-rooms-response", { rooms: getRooms() });

        socket.emit('document-list-changed', getPostList());

        // broadcast message to all sockets
        // setImmediate(() => server.emit("msg2client", `welcome socket ${socket.id} join chat app`));
    
        socket.on("msg2server", (msg: string) => {
            console.log(socket.client.request.headers['authorization']);
            console.log(socket.client.request.url);
            socket.emit("msg2client", `received your message: ${msg}`);
        });
    
        // broadcast message to other sockets
        socket.on("msg2others", (msg: string) => {
            socket.broadcast.emit("msg2client", msg);
        })

        socket.on('join-room', (event: { name: string, room: string }) => {
            addUser({ id: socket.id, name: event.name });
            joinRoom(event.name, event.room);
            if (joinedRoom !== '') {
                socket.leave(joinedRoom);
            }

            socket.join(event.room);
            joinedRoom = event.room;

            socket.broadcast.to(event.room).emit('msg2client', `welcome ${event.name} join ${event.room}`);
            server.to(event.room).emit('msg2client', `welcome ${event.name} join ${event.room}`);
        });

        socket.on('add-room', (args: { room: string }) => {
            if (addRoom(args.room)) {
                server.emit('get-rooms-response', { rooms: getRooms() });
            }
        });

        socket.on('remove-room', (args: { room: string }) => {
            if (removeRoom(args.room)) {
                server.emit('get-rooms-response', { rooms: getRooms() });
            }
        });

        socket.on('create-document', (args: { id: string }) => {
            savePost(args.id, '');
            socket.emit('document-list-changed', getPostList());
        })

        socket.on('get-document', (args: { id: string }) => {
            socket.emit('get-document-response', { content: getPost(args.id) });
        })

        socket.on('delete-document', (args: { id: string }) => {
            deletePost(args.id);
            socket.emit('document-list-changed', getPostList());
        })

        socket.on('update-document', (args: { id: string, content: string }) => {
            savePost(args.id, args.content);
            socket.broadcast.emit('document-changed', { id: args.id });
        });

        socket.on('issue-login-token', async (args: { email: string, password: string }) => {
            const user = await getUser(args.email);
            if (validatePassword(user, args.password)) {
                const token = issueToken({ email: args.email, role: user?.Role || '' });
                socket.emit('login-token-issued', {
                    code: '123',
                    message: '123',
                    data: token
                });
            }
        })

        socket.on('query-user-profile', async () => {
            const payload = getTokenPayload(socket.client.request.headers['authorization']);
            const user = await getUser(payload?.email || '');
            console.log(user);
            socket.emit('user-profile', user?.Name);
        });
    });

    server.use((socket, next) => {
        console.log('socket middleware works');
        console.log(socket.client.request.headers['authorization']);
        console.log(socket.client.request.url);
        next();
    });

    server.listen(port);
}