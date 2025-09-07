const avatarModel = require('../models/avatarModel');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Create Avatar
exports.createAvatar = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;
    const userId = req.user?.id; // from auth middleware

    // Basic validation
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    if (!name || !imageUrl) {
      return res.status(400).json({ message: 'name and imageUrl are required' });
    }

    const created = await avatarModel.create({ userId, name, imageUrl });
    res.status(201).json({ avatar: created });
  } catch (err) {
    console.error('Create avatar error:', err);
    res.status(500).json({ message: 'Failed to create avatar' });
  }
};


// Get Avatar
exports.getAvatar = async (req, res) => {
  try {
    const userId = req.user?.id; // from auth middleware
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const avatar = await avatarModel.getAvatar(userId);
    if (!avatar) {
      return res.status(404).json({ message: 'Avatar not found' });
    }

    res.status(200).json({ avatar });
  } catch (err) {
    console.error('Get avatar error:', err);
    res.status(500).json({ message: 'Failed to get avatar' });
  }
};


// Update Avatar
exports.updateAvatar = async (req, res) => {
  const { name, imageUrl } = req.body;
  const userId = req.user?.id; // from auth middleware

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const updated = await avatarModel.updateAvatar(userId, { name, imageUrl });
    res.json({ avatar: updated });
  } catch (err) {
    console.error('updateAvatar error:', err);
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Duplicate field value.' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Delete avatar
exports.deleteAvatar = async (req, res) => {
  const userId = req.user?.id; // from auth middleware

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    await avatarModel.deleteAvatar(userId);
    res.status(200).json({ message: 'Avatar deleted successfully' });
  } catch (err) {
    console.error('deleteAvatar error:', err);
    res.status(500).json({ message: 'Failed to delete avatar' });
  }
};