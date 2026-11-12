export function debugMode(): boolean {
    return sessionStorage.getItem('debug') ? true : false;
}

export function getKey(): string {
  return localStorage.getItem('api_key') ?? '';
}

export function updateKey(key: string): void {
  localStorage.setItem('api_key', key);
}

export function updateSSOUrl(url: string): void {
  localStorage.setItem('sso_url', url);
}

export function getTokens(): { accessToken: string; refreshToken: string } {
    return {
        accessToken: sessionStorage.getItem("user_access_token") ?? '',
        refreshToken: sessionStorage.getItem("user_refresh_token") ?? ''
    };
}

export function updateTokens(tokens: { accessToken: string, refreshToken: string }): void {
    sessionStorage.setItem("user_access_token", tokens.accessToken);
    sessionStorage.setItem("user_refresh_token", tokens.refreshToken);
}

export function getAuthorization(): string {
    return `Bearer ${getTokens().accessToken}`;
}

export function clearStorage(isLocal: boolean = false) {
    if (isLocal) {
        localStorage.clear();
    } else {
        sessionStorage.clear();
    }
}

export function getEmail(): string {
    return sessionStorage.getItem("user_email") ?? '';
}

export function updateEmail(email: string): void {
    sessionStorage.setItem("user_email", email);
}