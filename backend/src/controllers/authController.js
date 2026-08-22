import { query } from '../config/db.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { generateToken } from '../utils/generateToken.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !emailPattern.test(email || '') || !password || password.length < 6) {
      return res.status(400).json({ message: 'Name, a valid email, and a password of at least 6 characters are required.' });
    }

    const passwordHash = await hashPassword(password);
    const result = await query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name.trim(), email.trim().toLowerCase(), passwordHash],
    );
    const user = result.rows[0];
    return res.status(201).json({ token: generateToken(user.id), user });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ message: 'An account with this email already exists.' });
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

    const result = await query('SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1', [email.trim().toLowerCase()]);
    const user = result.rows[0];
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    delete user.password_hash;
    return res.json({ token: generateToken(user.id), user });
  } catch (error) {
    return next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    const result = await query('SELECT id, name, email, created_at AS "createdAt" FROM users WHERE id=$1', [req.user.id]);
    if (!result.rowCount) return res.status(404).json({ message: 'User not found.' });
    return res.json({ user: result.rows[0] });
  } catch (error) { return next(error); }
}

export async function updateMe(req, res, next) {
  try {
    const name = req.body.name?.trim();
    if (!name) return res.status(400).json({ message: 'Name is required.' });
    const result = await query('UPDATE users SET name=$1 WHERE id=$2 RETURNING id, name, email, created_at AS "createdAt"', [name, req.user.id]);
    if (!result.rowCount) return res.status(404).json({ message: 'User not found.' });
    return res.json({ user: result.rows[0] });
  } catch (error) { return next(error); }
}
