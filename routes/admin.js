// routes/admin.js
const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');
const { authRequired, requireAdmin } = require('../middlewares/authMiddleware');

router.post('/promote', authRequired, requireAdmin, admin.promote);

// optional bootstrap route
router.post('/bootstrap', admin.bootstrap);

module.exports = router;
