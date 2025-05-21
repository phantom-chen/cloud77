import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc'; // Encryption algorithm
const secretKey = crypto.randomBytes(32); // Generate a 32-byte secret key
const iv = crypto.randomBytes(16); // Initialization vector

export interface TokenPayload {
    id: string;
    username: string;
    email: string;
}

export function encrypt(text: string): { encryptedData: string; iv: string } {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedData: encrypted, iv: iv.toString('hex') };
}

export function decrypt(encryptedData: string, ivHex: string): string {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(ivHex, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export function issueToken(user: string) {
    const token = encrypt(user);
    return token.encryptedData;
}

export function getUser(token: string) {
    const decrypted = decrypt(token, iv.toString('hex'));
    return decrypted;
}