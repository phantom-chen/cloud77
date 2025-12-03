import { Request, Response } from "express";
import { ChatRoomTemplate, IChatRoom } from "../models/room";
import { generateID } from "../models/guid";

export function getRooms(req: Request, res: Response) {
    res.json({ rooms: ['room1'] });
}

export function createRoom(req: Request, res: Response) {
    const name = req.query['name'];
    console.log(name);

    const room = Object.assign({}, ChatRoomTemplate);
    room.id = generateID(6);
    room.name = name ? String(name) : 'default';
    console.log(room);
    res.json({ message: 'Room created' });
}