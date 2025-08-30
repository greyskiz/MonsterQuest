const express = require('express');
const router = express.Router();

const ctl = require('../controllers/monsterController');
const { authRequired, requireAdmin } = require('../middlewares/authMiddleware');

// public listing (used by Home/timer page)
router.get('/', ctl.listPublic);

// admin list + CRUD
router.get('/admin', authRequired, requireAdmin, ctl.listAdmin);
router.post('/',     authRequired, requireAdmin, ctl.create);
router.patch('/:id', authRequired, requireAdmin, ctl.update);
router.delete('/:id',authRequired, requireAdmin, ctl.remove);

module.exports = router;
