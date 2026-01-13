import { Request, Response } from 'express';
import os, { networkInterfaces } from 'os';

function getIPAddress(): string {
    let address = "";
    const interfaces = networkInterfaces();

    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name]!) {
            if (net.family === 'IPv4' && !net.internal) {
                address = net.address;
                break;
            }
        }
        if (address) {
            break;
        }
    }

    if (address) {
        return address;
    }

    const infos = interfaces.eth0;
    if (infos) {
        address = infos[0].address;
    }

    return address;
}

console.log(getIPAddress());

export function getServiceAgent(req: Request, res: Response) {
    res.json({
        service: 'canteen_service',
        version: '1.0.0.0',
        tags: [
            `ENVIRONMENT=${process.env.NODE_ENV || 'Development'}`,
            `CUSTOM_LOGGING=${process.env.CUSTOM_LOGGING || 'txt'}`
        ],
        machine: os.hostname(),
        hostname: os.hostname(),
        ip: getIPAddress(),
        environment: process.env.NODE_ENV || 'Development',
        logging: process.env.CUSTOM_LOGGING || 'txt'
    });
}