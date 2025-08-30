// controllers/adminController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Promote a user to ADMIN
exports.promote = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'userId required' });

  await prisma.user.update({
    where: { id: userId },
    data: { role: 'ADMIN' },
  });
  res.status(204).end();
};

// Optional: one-time bootstrap admin route (guarded by env secret)
exports.bootstrap = async (req, res) => {
  const secret = req.header('X-Setup-Secret');
  if (!process.env.ADMIN_BOOTSTRAP_SECRET || secret !== process.env.ADMIN_BOOTSTRAP_SECRET) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'email required' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  await prisma.user.update({ where: { id: user.id }, data: { role: 'ADMIN' } });
  res.status(204).end();
};
