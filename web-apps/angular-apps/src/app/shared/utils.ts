import { Buffer } from 'buffer';
import { Md5 } from "md5-typescript";

export function hashString(value: string): string {
    return Md5.init(value);
}

// window.btoa();
export function convertToBase64(value: string): string {
    const buffer = Buffer.from(value);
    return buffer.toString('base64');
}

// window.atob();
export function convertFromBase64(value: string): string {
    const buffer = Buffer.from(value, 'base64');
    return buffer.toString();
}

export function timestampToDate(timestamp: string): Date {
    const year = Number(timestamp.substring(0, 4));
    const month = Number(timestamp.substring(4, 6));
    const day = Number(timestamp.substring(6, 8));
    const hour = Number(timestamp.substring(8, 10));
    const minute = Number(timestamp.substring(10, 12));
    const second = Number(timestamp.substring(12, 14));
    const date = new Date();
    date.setUTCFullYear(year, month, day);
    date.setUTCHours(hour, minute, second);
    return date;
}

export function getRemainingTime(date1: Date, date2: Date): {
    day: number,
    hour: number,
    minute: number
} {
    return {
        day: date2.getUTCDate() - date1.getUTCDate(),
        hour: date2.getUTCHours() - date1.getUTCHours(),
        minute: date2.getUTCMinutes() - date1.getUTCMinutes()
    }
}