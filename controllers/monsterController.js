const model = require('../models/monsterModel');

exports.listPublic = async (req, res) => {
  try {
    const monsters = await model.list({
      tier:  req.query.tier,   // e.g. "QUICK" | "STANDARD" | "LONG" | "All"
      scope: req.query.scope,  // "SOLO" | "PARTY" | "All"
    });
    res.json({ monsters });
  } catch (err) {
    console.error('List monsters error:', err);
    res.status(500).json({ message: 'Failed to fetch monsters' });
  }
};

exports.listAdmin = async (req, res) => {
  // same as public, but guarded by admin middleware on the route
  return exports.listPublic(req, res);
};

exports.create = async (req, res) => {
  try {
    const { name, tier, scope, minutes, imageUrl, baseCoins } = req.body;
    if (!name || !tier || !scope || !minutes) {
      return res.status(400).json({ message: 'name, tier, scope, minutes are required' });
    }
    const created = await model.create({ name, tier, scope, minutes, imageUrl, baseCoins });
    res.status(201).json({ monster: created });
  } catch (err) {
    console.error('Create monster error:', err);
    res.status(500).json({ message: 'Failed to create monster' });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await model.update(id, req.body);
    res.json({ monster: updated });
  } catch (err) {
    console.error('Update monster error:', err);
    res.status(500).json({ message: 'Failed to update monster' });
  }
};

exports.remove = async (req, res) => {
  try {
    await model.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error('Delete monster error:', err);
    res.status(500).json({ message: 'Failed to delete monster' });
  }
};

