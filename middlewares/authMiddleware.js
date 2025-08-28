const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY || 'dev-secret';

function authRequired(req, res, next) {
  const bearer = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null;

  const token = req.cookies?.token || bearer; // ✅ prefer cookie
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const payload = jwt.verify(token, secretKey);
    req.user = { id: payload.sub || payload.id, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
  next();
}

module.exports = { authRequired, requireAdmin };
