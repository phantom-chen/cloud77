//#region shared in apps
export function debugMode(): boolean {
    return localStorage.getItem('debug') ? true : false;
}

export function ssoUrl(): string {
    return localStorage.getItem("sso_url") || "";
}

export function ssoMessageUrl(): string {
    const url = ssoUrl();
    return url ? `${url}/message` : '';
}

export function ssoMessageLoaded(): boolean {
    return sessionStorage.getItem("sso_message_loaded") ? true : false;
}

export function appMessageUrl(): string {
    return sessionStorage.getItem("user_app_message") ?? "";
}

export function appMessageLoaded(): boolean {
    return sessionStorage.getItem('app_message_loaded') ? true : false;
}

export function appUrl(): string {
    return sessionStorage.getItem("user_app_url") ?? "";
}

export function apiKey(): string {
    return localStorage.getItem('api_key') || ''
}
//#endregion

export function getTokens(storage: 'local' | 'session'): { access: string, refresh: string } {
    if (storage === 'session') {
        return {
            access: sessionStorage.getItem(`user_access_token`) ?? '',
            refresh: sessionStorage.getItem(`user_refresh_token`) ?? ''
        }
    } else {
        return {
            access: localStorage.getItem(`user_access_token`) ?? '',
            refresh: localStorage.getItem(`user_refresh_token`) ?? ''
        }
    }
}

export function removeTokens(storage: 'local' | 'session'): void {
    if (storage === 'session') {
        sessionStorage.removeItem(`user_access_token`);
        sessionStorage.removeItem(`user_refresh_token`);
        sessionStorage.removeItem(`user_email`);
    } else {
        localStorage.removeItem(`user_access_token`);
        localStorage.removeItem(`user_refresh_token`);
        localStorage.removeItem(`user_email`);
    }
}

export function saveTokens(storage: 'local' | 'session', access: string, refresh: string): void {
    if (storage === 'session') {
        sessionStorage.setItem(`user_access_token`, access);
        sessionStorage.setItem(`user_refresh_token`, refresh);
        return;
    }
    localStorage.setItem(`user_access_token`, access);
    localStorage.setItem(`user_refresh_token`, refresh);
}

export function rememberMe(): string {
    return localStorage.getItem("remember_me") ?? "";
}

export function userEmail(storage: 'local' | 'session'): string {
    const key = "user_email";
    if (storage === 'local') {
        return localStorage.getItem(key) ?? '';
    }
    return sessionStorage.getItem(key) ?? '';
}