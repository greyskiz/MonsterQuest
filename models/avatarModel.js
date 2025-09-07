const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Create Avatar
exports.create = async (data) => {
  const { userId, name, imageUrl } = data;

  return prisma.avatar.create({
    data: {
      userId,
      name,
      imageUrl,
      // headId, bodyId, weaponId will default to null
    },
  });
};


// Get avatar by userId
exports.getAvatar = async (userId) => {
  return prisma.avatar.findUnique({
    where: { userId },
    // include: {
    //   head: true,
    //   body: true,
    //   weapon: true,
    // },
  });
};


// Update avatar (name and imageUrl only)
exports.updateAvatar = async (userId, data) => {
  const { name, imageUrl } = data;

  return prisma.avatar.update({
    where: { userId },
    data: {
      ...(name ? { name } : {}),
      ...(imageUrl ? { imageUrl } : {}),
    },
  });
};


// Delete avatar
exports.deleteAvatar = async (userId) => {
  return prisma.avatar.delete({
    where: { userId },
  });
};