// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET_KEY || 'dev-secret';

async function authRequired(req, res, next) {
  const bearer = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null;
  const token = req.cookies?.token || bearer;
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const payload = jwt.verify(token, secretKey); // { sub }
    const user = await prisma.user.findUnique({
      where: { id: payload.sub || payload.id },
      select: { id: true, username: true, email: true, displayName: true, role: true }, // what the req.user contains
    });
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user; // fresh user each request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
  next();
}

module.exports = { authRequired, requireAdmin };
