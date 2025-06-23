import { createHash, randomBytes, pbkdf2Sync } from 'crypto';

export function hashPassword(password) {
    const salt = randomBytes(16).toString('hex');
    const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}

export function validatePassword(password, storedHash) {
    const [salt, originalHash] = storedHash.split(':');
    const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === originalHash;
}
