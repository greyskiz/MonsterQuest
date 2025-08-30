// models/monsterModel.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Return all MonsterTemplate rows ordered by createdAt desc
 */
async function listAll() {
  return prisma.monsterTemplate.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * Create a MonsterTemplate row
 * @param {Object} input - { name, tier, minutes, imageUrl, baseCoins? }
 */
async function create(input) {
  const { name, tier, minutes, imageUrl, baseCoins } = input;

  return prisma.monsterTemplate.create({
    data: {
      name,
      tier,
      minutes,
      imageUrl,
      baseCoins: typeof baseCoins === 'number' ? baseCoins : null
    }
  });
}

/**
 * Delete by id
 */
async function remove(id) {
  return prisma.monsterTemplate.delete({
    where: { id }
  });
}

/**
 * Get one by id
 */
async function getById(id) {
  return prisma.monsterTemplate.findUnique({ where: { id } });
}

module.exports = {
  listAll,
  create,
  remove,
  getById
};
