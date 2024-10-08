import { existsSync, readFileSync, writeFileSync } from 'fs';

export interface User {
    id: string,
    name: string,
    rooms?: string[]
}

const users: User[] = [];

export const addUser = (user: User) => {
    if (!users.some(u => u.name === user.name)) {
        users.push(user);
    }
}

export const joinRoom = (name: string, room: string) => {
    const user = users.find(u => u.name === name);
    if (user) {
        user.rooms = [...user.rooms || [], ...[room]];
    }
}

const roomFile = 'data/rooms.json';

export function addRoom(room: string): boolean {
    createEmptyRooms();
    const source = getRooms();
    if (source.includes(room)) {
        return false;
    } else {
        const rooms = [...source, room];
        saveRooms(rooms);
        return true;
    }
}

export function removeRoom(room: string): boolean {
    const source = getRooms();
    if (source.includes(room)) {
        const index = source.indexOf(room);
        const rooms = [...source.slice(0, index), ...source.slice(index + 1)];
        saveRooms(rooms);
        return true;
    } else {
        return false;
    }
}

function saveRooms(rooms: string[]): void {
    createEmptyRooms();
    const content = JSON.stringify(rooms, undefined, 2);
    writeFileSync(roomFile, content);
}

export function getRooms(): string[] {
    createEmptyRooms();
    const content = readFileSync(roomFile).toString();
    return JSON.parse(content) as string[];
}

function createEmptyRooms(): void {
    if (!existsSync(roomFile)) {
        writeFileSync(roomFile, JSON.stringify([]));
    } 
}
