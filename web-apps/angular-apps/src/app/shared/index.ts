import { Buffer } from 'buffer';
import { Md5 } from "md5-typescript";

export * from './shared.module';

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

export function debugMode(): boolean {
    return sessionStorage.getItem('cloud77_debug_mode') ? true : false;
}

export function getUserEmail(): string {
    return localStorage.getItem('user_email') ?? '';
}

export function updateUserEmail(email: string): void {
    localStorage.setItem('user_email', email);
}

export function getUserEmails(isLogin: boolean = true): string[] {
    const users = localStorage.getItem("user_emails")?.split(',') ?? [];
    if (!isLogin) return users;

    const _users: string[] = users.map(u => {
        return localStorage.getItem(`access_token_${hashString(u)}`) ? u : '';
    });

    return _users.filter(u => u);
}

export function addUserEmail(email: string): void {
    const emails = getUserEmails();
    if (!emails.includes(email)) {
        emails.push(email);
        localStorage.setItem('user_emails', emails.join(','));
    }
}

export function removeTokens(): void {
    localStorage.removeItem(`user_access_token`);
    localStorage.removeItem(`user_refresh_token`);
    sessionStorage.removeItem(`cloud77_access_token`);
    sessionStorage.removeItem(`cloud77_refresh_token`);
}

export function removeUserEmail(email: string): void {
    removeTokens();
    const users = getUserEmails();
    localStorage.setItem('user_emails', users.filter(u => u != email).join(','));
}

export function saveTokens(access: string, refresh: string): void {
    localStorage.setItem(`user_access_token`, access);
    localStorage.setItem(`user_refresh_token`, refresh);
    syncTokens();
}

export function syncTokens(): void {
    sessionStorage.setItem('cloud77_access_token', localStorage.getItem(`user_access_token`) ?? '');
    sessionStorage.setItem('cloud77_refresh_token', localStorage.getItem(`user_refresh_token`) ?? '');
}

export function getTokens(session: boolean = true): { access: string, refresh: string } {
    if (session) {
        return {
            access: sessionStorage.getItem(`cloud77_access_token`) ?? '',
            refresh: sessionStorage.getItem(`cloud77_refresh_token`) ?? ''
        }
    } else {
        return {
            access: localStorage.getItem(`user_access_token`) ?? '',
            refresh: localStorage.getItem(`user_refresh_token`) ?? ''
        }
    }
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
