// controllers/monsterController.js
const monsterModel = require('../models/monsterModel');

const TIER_MINUTES = {
  QUICK:    new Set([5, 10, 15]),
  STANDARD: new Set([30, 40, 45]),
  LONG:     new Set([60, 90, 120]),
};

function validateTierMinutes(tier, minutes) {
  const set = TIER_MINUTES[tier];
  return set && set.has(Number(minutes));
}

/**
 * GET /api/monster
 * Admin list of templates
 */
async function list(req, res) {
  try {
    const rows = await monsterModel.listAll();
    res.json(rows);
  } catch (e) {
    console.error('Monster list error:', e);
    res.status(500).json({ message: 'Failed to load monsters' });
  }
}

/**
 * POST /api/monster
 * Body: { name, tier, minutes, imageUrl, baseCoins? }
 * Note: client may send `scope` but DB model doesn’t have it; we ignore it.
 */
async function create(req, res) {
  try {
    const { name, tier, minutes, imageUrl, baseCoins } = req.body || {};

    if (!name || !tier || !minutes || !imageUrl) {
      return res.status(400).json({
        message: 'name, tier, minutes, and imageUrl are required.'
      });
    }

    if (!validateTierMinutes(tier, minutes)) {
      return res.status(400).json({
        message: `minutes must match ${tier} options.`
      });
    }

    const row = await monsterModel.create({
      name: String(name).trim(),
      tier,
      minutes: Number(minutes),
      imageUrl: String(imageUrl).trim(),
      baseCoins: typeof baseCoins === 'number' ? baseCoins : undefined
    });

    return res.status(201).json(row);
  } catch (e) {
    console.error('Monster create error:', e);
    return res.status(500).json({ message: 'Create failed' });
  }
}

/**
 * DELETE /api/monster/:id
 */
async function destroy(req, res) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'id is required' });

    // throw if not found -> 404
    const exists = await monsterModel.getById(id);
    if (!exists) return res.status(404).json({ message: 'Not found' });

    await monsterModel.remove(id);
    return res.status(204).end();
  } catch (e) {
    console.error('Monster delete error:', e);
    return res.status(500).json({ message: 'Delete failed' });
  }
}

module.exports = { list, create, destroy };
