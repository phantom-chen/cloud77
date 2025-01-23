export function debugMode(): boolean {
    return sessionStorage.getItem('cloud77_debug') ? true : false;
}

export function mockupData(): boolean {
    return sessionStorage.getItem('cloud77_mockup') ? true : false;
}