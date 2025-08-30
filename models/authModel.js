// models/authModel.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.findByEmail = (email) =>
  prisma.user.findUnique({ where: { email } });

exports.findByUsername = (username) =>
  prisma.user.findUnique({ where: { username } });

exports.createUser = (data) =>
  prisma.user.create({ data });

exports.updateUser = (id, data) =>
  prisma.user.update({ where: { id }, data });

exports.deleteUser = (id) =>
  prisma.user.delete({ where: { id } });
