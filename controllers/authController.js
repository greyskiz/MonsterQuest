const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../../database'); 
const createError = require('http-errors');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

exports.register = async (req, res, next) => {
  try {
    const { displayName, email, password } = req.body;
    if (!displayName || !email || !password) {
      throw createError(400, 'displayName, email, and password are required.');
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw createError(409, 'Email already in use.');

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        displayName,
        email,
        passwordHash,
        
      },
      select: { id: true, email: true, displayName: true, isAdmin: true }
    });

    const token = signToken({ sub: user.id, role: user.isAdmin ? 'admin' : 'user' });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.isAdmin ? 'admin' : 'user'
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw createError(400, 'email and password are required.');

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, displayName: true, isAdmin: true, passwordHash: true }
    });
    if (!user) throw createError(401, 'Invalid email or password.');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw createError(401, 'Invalid email or password.');

    const token = signToken({ sub: user.id, role: user.isAdmin ? 'admin' : 'user' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.isAdmin ? 'admin' : 'user'
      }
    });
  } catch (err) {
    next(err);
  }
};
