import socketClient, { Socket } from 'socket.io-client';

let _socket: Socket;

export function createSocket(): Socket {
    if (_socket) return _socket;

    _socket = socketClient('', { path: '/canteen-ws' });
    return _socket;
}