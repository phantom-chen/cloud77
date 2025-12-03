const Codes = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export function generateID(length: number): string {
    let id = '';
    for (let i = 0; i < length; i++) {
        id += Codes.charAt(Math.floor(Math.random() * Codes.length));
    }

    return id;
}