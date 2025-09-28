import { createHash, randomBytes } from 'crypto';

// Server-side CSRF utilities (Node.js only)
export function generateCSRFTokenServer(): string {
  return randomBytes(32).toString('hex');
}

export function createCSRFHashServer(token: string, secret: string): string {
  return createHash('sha256')
    .update(token + secret)
    .digest('hex');
}

export function verifyCSRFTokenServer(token: string, hash: string, secret: string): boolean {
  const expectedHash = createCSRFHashServer(token, secret);
  return hash === expectedHash;
}
