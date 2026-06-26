const router = require('express').Router();
const ctrl = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/login',           ctrl.login);
router.post('/register',        ctrl.register);
router.get('/me',               authenticate, ctrl.me);
router.put('/profile',          authenticate, ctrl.updateProfile);
router.post('/avatar',          authenticate, upload.single('avatar'), ctrl.uploadAvatar);
router.put('/change-password',  authenticate, ctrl.changePassword);

module.exports = router;
