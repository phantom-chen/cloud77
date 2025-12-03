import { existsSync, readFileSync, writeFileSync } from "fs";
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

export function createEmptyRooms(): void {
    if (!existsSync(roomFile())) {
        writeFileSync(roomFile(), JSON.stringify([]));
    }
}

function saveRooms(rooms: IChatRoom[]): void {
    createEmptyRooms();
    const content = JSON.stringify(rooms, undefined, 2);
    writeFileSync(roomFile(), content);
}

export function getRooms(): IChatRoom[] {
    createEmptyRooms();
    const content = readFileSync(roomFile()).toString();
    return JSON.parse(content) as IChatRoom[];
}

export function addRoom(room: IChatRoom): boolean {
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

export function removeRoom(room: IChatRoom): boolean {
    createEmptyRooms();
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