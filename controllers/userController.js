// controllers/userController.js
const bcrypt = require('bcrypt');
const authModel = require('../models/authModel');

exports.getUser = async (req, res) => {
  res.json({ user: req.user }); // req.user was hydrated by middleware
};

exports.updateUser = async (req, res) => {
  const { username, email, displayName } = req.body;
  try {
    const updated = await authModel.updateUser(req.user.id, {
      ...(username ? { username } : {}),
      ...(email ? { email } : {}),
      ...(displayName ? { displayName } : {}),
    });
    res.json({
      user: {
        id: updated.id,
        username: updated.username,
        email: updated.email,
        displayName: updated.displayName,
        role: updated.role,
      },
    });
  } catch (err) {
    console.error('updateUser error:', err);
    if (err.code === 'P2002') return res.status(409).json({ message: 'Duplicate field value.' });
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'currentPassword and newPassword are required' });
  }
  const user = await authModel.findByUsername(req.user.username);
  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Wrong current password' });

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await authModel.updateUser(req.user.id, { passwordHash });
  res.status(204).end();
};

exports.deleteUser = async (req, res) => {
  await authModel.deleteUser(req.user.id);
  res.clearCookie('token', { path: '/' });
  res.status(204).end();
};
