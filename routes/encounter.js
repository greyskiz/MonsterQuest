const router = require('express').Router();
const { authRequired } = require('../middlewares/authMiddleware');
const c = require('../controllers/encounterController');

router.post('/start',          authRequired, c.start);
router.patch('/:id/heartbeat', authRequired, c.heartbeat);
router.patch('/:id/pause',     authRequired, c.pause);
router.patch('/:id/resume',    authRequired, c.resume);
router.patch('/:id/reset',     authRequired, c.reset);
router.patch('/:id/complete',  authRequired, c.complete);

module.exports = router;
