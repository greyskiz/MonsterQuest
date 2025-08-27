const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function auth(requiredRole = null) {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      if (!token) throw createError(401, 'Missing token.');

      const payload = jwt.verify(token, JWT_SECRET);
      req.user = { id: payload.sub, role: payload.role };

      if (requiredRole && payload.role !== requiredRole) {
        throw createError(403, 'Forbidden.');
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
