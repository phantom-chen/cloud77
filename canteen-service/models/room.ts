import { existsSync, readFileSync, writeFileSync } from "fs";

const roomFile = 'data/canteen/rooms.json';

function createEmptyRooms(): void {
    if (!existsSync(roomFile)) {
        writeFileSync(roomFile, JSON.stringify([]));
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