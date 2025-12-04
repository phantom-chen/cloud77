import { decrypt, encrypt, hashPassword, verifyPassword } from './apps/user';

// Example usage
const textToEncrypt = 'Hello, World!';
const encrypted = encrypt(textToEncrypt);
console.log('Encrypted:', encrypted);

const decrypted = decrypt(encrypted.encryptedData, encrypted.iv);
console.log('Decrypted:', decrypted);

const hashed = hashPassword('abc123#');
console.log(hashed);
console.log(verifyPassword('abc123#', hashed));
console.log(verifyPassword('abc123', hashed));