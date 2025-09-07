const router = require('express').Router();
const avatar = require('../controllers/avatarController');
const { authRequired } = require('../middlewares/authMiddleware');


router.post("/", authRequired, avatar.createAvatar);
router.get("/", authRequired, avatar.getAvatar);
router.patch("/", authRequired, avatar.updateAvatar);
router.delete("/", authRequired, avatar.deleteAvatar);


module.exports = router;
