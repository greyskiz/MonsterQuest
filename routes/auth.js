const express = require('express');
const router = express.Router();

const auth = require('../controllers/authController');
const authMw = require('../middlewares/authMiddleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/register', auth.register);
router.post('/login', auth.login);

// server-trusted profile
router.get('/me', authMw.authRequired, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, username: true, email: true, role: true } 
  });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

// clear cookie
router.post('/logout', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.status(204).end();
});

module.exports = router;
