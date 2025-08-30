// routes/users.js
const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');
const { authRequired } = require('../middlewares/authMiddleware');

// current user
router.get('/user', authRequired, user.getUser);
router.patch('/user', authRequired, user.updateUser);
router.patch('/user/password', authRequired, user.changePassword);
router.delete('/user', authRequired, user.deleteUser);

module.exports = router;
