const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// helper: treat "All" / empty as no filter
function clean(v) {
  if (!v) return undefined;
  if (typeof v === 'string' && v.toLowerCase() === 'all') return undefined;
  return v;
}

exports.list = async (filters = {}) => {
  const where = {};
  const tier  = clean(filters.tier);
  const scope = clean(filters.scope);

  if (tier)  where.tier  = tier;   // QUICK | STANDARD | LONG
  if (scope) where.scope = scope;  // SOLO | PARTY

  return prisma.monsterTemplate.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
};

exports.get = async (id) => {
  return prisma.monsterTemplate.findUnique({ where: { id } });
};

exports.create = async (data) => {
  const { name, tier, scope, minutes, imageUrl, baseCoins } = data;

  return prisma.monsterTemplate.create({
    data: {
      name,
      tier,            // must be one of the enum values
      scope,           // must be one of the enum values
      minutes: Number(minutes),
      baseCoins: baseCoins == null ? null : Number(baseCoins),
      imageUrl: imageUrl || null,
    },
  });
};

exports.update = async (id, data) => {
  const payload = {};
  if (data.name != null)      payload.name = data.name;
  if (data.tier != null)      payload.tier = data.tier;
  if (data.scope != null)     payload.scope = data.scope;
  if (data.minutes != null)   payload.minutes = Number(data.minutes);
  if (data.baseCoins != null) payload.baseCoins = Number(data.baseCoins);
  if (data.imageUrl !== undefined) payload.imageUrl = data.imageUrl || null;

  return prisma.monsterTemplate.update({
    where: { id },
    data: payload,
  });
};

exports.remove = async (id) => {
  return prisma.monsterTemplate.delete({ where: { id } });
};
