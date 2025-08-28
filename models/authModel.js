const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  async findByEmail(email) {
    if (!email) return null;
    return prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, username: true, displayName: true, role: true, passwordHash: true }
    });
  },

  async findByUsername(username) {
    if (!username) return null;
    return prisma.user.findUnique({
      where: { username },
      select: { id: true, email: true, username: true, displayName: true, role: true, passwordHash: true }
    });
  },

  async createUser({ username, email, passwordHash, role, displayName }) {
    return prisma.user.create({
      data: { username, email, passwordHash, role, displayName }, 
      select: { id: true, email: true, username: true, displayName: true, role: true }
    });
  }
};
