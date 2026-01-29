import { appendFileSync, existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { localData } from "./local-data";

export interface IChatRoom {
    id: string; // generate id
    name: string;   // user defined
    description: string;    // user defined
    capacity: number;   // user defined
    location: string;
    amenities: string[];
    features: string[];
    availability: {
        monday: { open: string; close: string; };
        tuesday: { open: string; close: string; };
        wednesday: { open: string; close: string; };
        thursday: { open: string; close: string; };
        friday: { open: string, close: string; };
        saturday: { open: string, close: string; };
        sunday: { open: string, close: string; };
    }
}

export const ChatRoomTemplate: IChatRoom = {
    id: '',
    name: '',
    description: 'A small canteen room',
    capacity: 10,
    location: 'Building A, Floor 1',
    amenities: [
        "Tables",
        "Chairs",
        "Vending Machines"
    ],
    features: [
        "Wi-Fi",
        "Air Conditioning",
        "Microwave"
    ],
    availability: {
        "monday": {
            "open": "08:00",
            "close": "20:00"
        },
        "tuesday": {
            "open": "08:00",
            "close": "20:00"
        },
        "wednesday": {
            "open": "08:00",
            "close": "20:00"
        },
        "thursday": {
            "open": "08:00",
            "close": "20:00"
        },
        "friday": {
            "open": "08:00",
            "close": "20:00"
        },
        "saturday": {
            "open": "10:00",
            "close": "18:00"
        },
        "sunday": {
            "open": "",
            "close": ""
        }
    }
};

function roomFile(): string {
    return join(localData(), 'rooms.json');
}

function connectionFile(): string {
    return join(localData(), 'connections.txt');
}

if (!existsSync(roomFile())) {
    writeFileSync(roomFile(), JSON.stringify([]));
}
if (!existsSync(connectionFile())) {
    writeFileSync(connectionFile(), '');
}

function saveRooms(rooms: IChatRoom[]): void {
    const content = JSON.stringify(rooms, undefined, 2);
    writeFileSync(roomFile(), content);
}

export function getRooms(): IChatRoom[] {
    const content = readFileSync(roomFile()).toString();
    return JSON.parse(content) as IChatRoom[];
}

export function addRoom(room: IChatRoom): boolean {
    const source = getRooms();
    if (source.includes(room)) {
        return false;
    } else {
        const rooms = [...source, room];
        saveRooms(rooms);
        return true;
    }
}

export function updateRoom(room: IChatRoom): boolean {
    const source = getRooms();
    const index = source.findIndex(r => r.id === room.id);
    if (index >= 0 && index < source.length) {
        const rooms = [...source.slice(0, index), room, ...source.slice(index + 1)];
        saveRooms(rooms);
        return true;
    }
    console.log(`Room with id ${room.id} not found for update.`);
    return false;
}

export function deleteRoom(id: string): boolean {
    const source = getRooms();
    const index = source.findIndex(r => r.id === id);
    if (index >= 0 && index < source.length) {
        const rooms = [...source.slice(0, index), ...source.slice(index + 1)];
        saveRooms(rooms);
        return true;
    }

    console.log(`Room with id ${id} not found for deletion.`);
    return false;
}

export function getRoom(id: string): IChatRoom | null {
    const source = getRooms();
    const room = source.find(r => r.id === id);
    if (!room) {
        console.log(`Room with id ${id} not found.`);
    }
    return room || null;
}

export function joinRoom(userId: string, roomId: string): void {
    const line = `${userId} ${roomId}\n`;
    appendFileSync(connectionFile(), line);
}

export function leaveRoom(userId: string, roomId: string): void {
    const lineToRemove = `${userId} ${roomId}`;
    const filePath = connectionFile();
    const data = readFileSync(filePath, "utf8");
    const lines = data.split("\n");
    const filteredLines = lines.filter(line => line.trim() !== lineToRemove || line === '');
    writeFileSync(filePath, filteredLines.join("\n"));
}

export function getUsersInRoom(roomId: string): string[] {
    const filePath = connectionFile();
    const data = readFileSync(filePath, "utf8");
    const lines = data.split("\n");
    const users: string[] = [];
    for (const line of lines) {
        const [userId, rId] = line.split(" ");
        if (rId === roomId) {
            users.push(userId);
        }
    }
    return users;
}

export function getRoomsForUser(userId: string): string[] {
    const filePath = connectionFile();
    const data = readFileSync(filePath, "utf8");
    const lines = data.split("\n");
    const rooms: string[] = [];
    for (const line of lines) {
        const [uId, roomId] = line.split(" ");
        if (uId === userId) {
            rooms.push(roomId);
        }
    }
    return rooms;
}