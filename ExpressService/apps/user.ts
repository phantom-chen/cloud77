import * as crypto from 'crypto';

// user entity
export interface User {
    email: string,
    firstName: string,
    lastName: string,
    salt: string,
    hashedPassword: string,
    dateCreated: Date
    isActive: boolean,
}

const algorithm = 'aes-256-cbc'; // Encryption algorithm
const secretKey = crypto.randomBytes(32); // Generate a 32-byte secret key
const iv = crypto.randomBytes(16); // Initialization vector

// Function to encrypt a string
export function encrypt(text: string): { encryptedData: string; iv: string } {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedData: encrypted, iv: iv.toString('hex') };
}

// Function to decrypt a string
export function decrypt(encryptedData: string, ivHex: string): string {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(ivHex, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const salt = 'your-salt-value'; // Replace with your own salt value
export function hashPassword(password: string): string {
    // return crypto.createHash('sha256').update(password).digest('hex');
    return crypto.createHmac('sha1', salt).update(password).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
    return hashPassword(password) === hash;
}