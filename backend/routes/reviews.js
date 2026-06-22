const router = require('express').Router();
const ctrl = require('../controllers/reviewController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/',          ctrl.getAll);
router.post('/',         authenticate, authorize('customer'), ctrl.create);
router.post('/:id/reply', authenticate, authorize('doctor','admin'), ctrl.reply);
router.post('/:id/like',  authenticate, ctrl.like);

module.exports = router;
