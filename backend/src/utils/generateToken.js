import crypto from 'crypto';

const base64Url = (value) => Buffer.from(value).toString('base64url');

export function generateToken(userId) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required.');
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64Url(JSON.stringify({ sub: userId, iat: Math.floor(Date.now() / 1000) }));
  const signature = crypto.createHmac('sha256', process.env.JWT_SECRET).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

export function verifyToken(token) {
  const [header, payload, signature] = token.split('.');
  if (!header || !payload || !signature || !process.env.JWT_SECRET) return null;
  const expected = crypto.createHmac('sha256', process.env.JWT_SECRET).update(`${header}.${payload}`).digest('base64url');
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}
