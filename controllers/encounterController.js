const encounters = require('../models/encounterModel');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.start = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { monsterId, monsterName } = req.body;

    let monster;
    if (monsterId) {
      monster = await prisma.monsterTemplate.findUnique({ where: { id: monsterId } });
    } else if (monsterName) {
      monster = await prisma.monsterTemplate.findFirst({
        where: { name: { equals: monsterName, mode: 'insensitive' } },
      });
    }

    if (!monster) return res.status(400).json({ message: 'Monster not found' });

    const encounter = await encounters.start({ userId, monster });
    res.json({ encounterId: encounter.id, plannedMinutes: monster.minutes });
  } catch (err) {
    console.error('Start encounter error:', err);
    res.status(500).json({ message: 'Failed to start encounter' });
  }
};

exports.heartbeat = async (req, res) => {
  try {
    await encounters.heartbeat({ encounterId: req.params.id, elapsed: Number(req.body.elapsed) || 0 });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to heartbeat' });
  }
};

exports.pause = async (req, res) => {
  try {
    await encounters.pause({ encounterId: req.params.id });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to pause' });
  }
};

exports.resume = async (req, res) => {
  try {
    await encounters.resume({ encounterId: req.params.id });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to resume' });
  }
};

exports.reset = async (req, res) => {
  try {
    await encounters.reset({ encounterId: req.params.id });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reset' });
  }
};

exports.complete = async (req, res) => {
  try {
    await encounters.complete({ encounterId: req.params.id });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to complete' });
  }
};
