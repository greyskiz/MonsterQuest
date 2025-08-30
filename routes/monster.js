const express = require('express');
const router = express.Router();

const ctl = require('../controllers/monsterController');
const { authRequired, requireAdmin } = require('../middlewares/authMiddleware');

router.get('/', authRequired, requireAdmin, ctl.list);
router.post('/', authRequired, requireAdmin, ctl.create);
router.delete('/:id', authRequired, requireAdmin, ctl.destroy);

module.exports = router;
