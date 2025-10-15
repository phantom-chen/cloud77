export * from './add';
export * from './good-bye';
export * from './hello';
export * from "./users";

const Codes = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export function generateID(): string {
    let id = '';
    for (let i = 0; i < 5; i++) {
        id += Codes.charAt(Math.floor(Math.random() * Codes.length));
    }

    return id;
}