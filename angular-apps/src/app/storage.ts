import { hashString } from "./sample/toolbox/toolbox.component";

export function debugMode(): boolean {
    return sessionStorage.getItem('cloud77_debug') ? true : false;
}

export function mockupData(): boolean {
    return sessionStorage.getItem('cloud77_mockup') ? true : false;
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

export function removeTokens(email: string): void {
    const key = hashString(email);

    localStorage.removeItem(`access_token_${key}`);
    localStorage.removeItem(`refresh_token_${key}`);
    sessionStorage.removeItem(`access_token_${key}`);
    sessionStorage.removeItem(`refresh_token_${key}`);
}

export function removeUserEmail(email: string): void {
    removeTokens(email);
    const users = getUserEmails();
    localStorage.setItem('user_emails', users.filter(u => u != email).join(','));
}

export function saveTokens(email: string, access: string, refresh: string): void {
    const key = hashString(email);
    localStorage.setItem(`access_token_${key}`, access);
    localStorage.setItem(`refresh_token_${key}`, refresh);
}

export function syncTokens(email: string): void {
    const key = hashString(email);
    sessionStorage.setItem('user_access_token', localStorage.getItem(`access_token_${key}`) ?? '');
    sessionStorage.setItem('user_refresh_token', localStorage.getItem(`refresh_token_${key}`) ?? '');
}

export function getTokens(email: string): { access: string, refresh: string } {
    const key = hashString(email);
    return {
        access: localStorage.getItem(`access_token_${key}`) ?? '',
        refresh: localStorage.getItem(`refresh_token_${key}`) ?? ''
    }
}