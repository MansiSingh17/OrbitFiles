import crypto from 'crypto';

export function calculateFileHash(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export function areFilesSimilar(hash1: string, hash2: string): boolean {
  return hash1 === hash2;
}