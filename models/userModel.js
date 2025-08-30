const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  findById(id) {
    return prisma.user.findUnique({ where: { id } });
  },
  findByUsername(username) {
    return prisma.user.findUnique({ where: { username } });
  },
  findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  },
  updateUser(id, updates) {
    return prisma.user.update({ where: { id }, data: updates });
  },
  updatePassword(id, passwordHash) {
    return prisma.user.update({ where: { id }, data: { passwordHash } });
  },
  delete(id) {
    return prisma.user.delete({ where: { id } });
  },
  // Admin: promote role
  setRoleById(id, role) {
    return prisma.user.update({ where: { id }, data: { role } });
  },
  setRoleByUsername(username, role) {
    return prisma.user.update({ where: { username }, data: { role } });
  },
  setRoleByEmail(email, role) {
    return prisma.user.update({ where: { email }, data: { role } });
  },
};
