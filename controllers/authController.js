require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');

const secretKey      = process.env.JWT_SECRET_KEY || 'dev-secret';
const tokenDuration  = process.env.JWT_EXPIRES_IN || '7d';
const tokenAlgorithm = process.env.JWT_ALGORITHM || 'HS256';

function signToken({ id, role }) {
  return jwt.sign({ sub: id, role }, secretKey, {
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

exports.register = async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email, and password are required.' });
    }

    const dupEmail = await authModel.findByEmail(email);
    if (dupEmail) return res.status(409).json({ message: 'Email already in use.' });

    const dupUser = await authModel.findByUsername(username);
    if (dupUser) return res.status(409).json({ message: 'Username already in use.' });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await authModel.createUser({
      username,
      email,
      passwordHash,
      role: 'USER',
      displayName: username,  
    });

    const token = signToken({ id: user.id, role: user.role });
    setAuthCookie(res, token);                   

    return res.status(201).json({ user });       
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

    const token = signToken({ id: user.id, role: user.role });
    setAuthCookie(res, token);                   

    const safe = {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
    };
    return res.json({ user: safe });             // no token in body
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
