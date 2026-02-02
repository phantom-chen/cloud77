export function getKey(): string {
    return localStorage.getItem('api_key') || '';
}