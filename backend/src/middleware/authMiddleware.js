import { verifyToken } from '../utils/generateToken.js';

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;
  const payload = token && verifyToken(token);

  if (!payload?.sub) return res.status(401).json({ message: 'Authentication required.' });
  req.user = { id: payload.sub };
  next();
}
