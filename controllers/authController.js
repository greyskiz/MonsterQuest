// controllers/authController.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');

const secretKey      = process.env.JWT_SECRET_KEY || 'dev-secret';
const tokenDuration  = process.env.JWT_EXPIRES_IN || '7d';
const tokenAlgorithm = process.env.JWT_ALGORITHM || 'HS256';

// JWT holds only identity
function signToken(userId) {
  return jwt.sign({ sub: userId }, secretKey, {
    algorithm: tokenAlgorithm,
    expiresIn: tokenDuration,
  });
}

function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

function toSafeUser(u) {
  return u
    ? {
        id: u.id,
        username: u.username,
        email: u.email,
        displayName: u.displayName,
        role: u.role,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      }
    : null;
}

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email, and password are required.' });
    }

    if (await authModel.findByEmail(email)) {
      return res.status(409).json({ message: 'Email already in use.' });
    }
    if (await authModel.findByUsername(username)) {
      return res.status(409).json({ message: 'Username already in use.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await authModel.createUser({
      username,
      email,
      passwordHash,
      displayName: username,
      role: 'USER',
    });

    const token = signToken(user.id);
    setAuthCookie(res, token);

    return res.status(201).json({ user: toSafeUser(user) });
  } catch (err) {
    console.error('Register error:', err);
    if (err.code === 'P2002') return res.status(409).json({ message: 'Duplicate field value.' });
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if ((!username && !email) || !password) {
      return res.status(400).json({ message: 'Provide username or email, and password.' });
    }

    let user = null;
    if (username) user = await authModel.findByUsername(username);
    if (!user && email) user = await authModel.findByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials.' });

    const token = signToken(user.id);
    setAuthCookie(res, token);

    return res.json({ user: toSafeUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.logout = (req, res) => {
  try {
    res.clearCookie('token', { path: '/' });
    return res.status(204).end();
  } catch {
    return res.status(200).json({ message: 'Logged out' });
  }
};
