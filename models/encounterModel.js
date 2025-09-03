const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.start = async ({ userId, monster }) => {
  const now = new Date();
  return prisma.encounter.create({
    data: {
      userId,
      monsterId: monster.id,
      status: 'ONGOING',
      startedAt: now,
      plannedDuration: monster.minutes,
      elapsed: 0,
    },
  });
};

exports.heartbeat = async ({ encounterId, elapsed }) => {
  return prisma.encounter.update({
    where: { id: encounterId },
    data: { elapsed, updatedAt: new Date() },
  });
};

exports.pause = async ({ encounterId }) => {
  return prisma.encounter.update({
    where: { id: encounterId },
    data: { status: 'PAUSED', updatedAt: new Date() },
  });
};

exports.resume = async ({ encounterId }) => {
  return prisma.encounter.update({
    where: { id: encounterId },
    data: { status: 'ONGOING', updatedAt: new Date() },
  });
};

exports.reset = async ({ encounterId }) => {
  return prisma.encounter.update({
    where: { id: encounterId },
    data: { status: 'ABANDONED', updatedAt: new Date() },
  });
};

exports.complete = async ({ encounterId }) => {
  return prisma.encounter.update({
    where: { id: encounterId },
    data: { status: 'COMPLETED', finishedAt: new Date(), updatedAt: new Date() },
  });
};
