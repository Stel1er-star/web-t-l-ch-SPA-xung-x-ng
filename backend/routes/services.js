const router = require('express').Router();
const ctrl = require('../controllers/serviceController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/',             ctrl.getAll);
router.get('/:id',          ctrl.getOne);
router.get('/:id/staff',    ctrl.getStaff);
router.post('/',   authenticate, authorize('admin'), ctrl.create);
router.put('/:id', authenticate, authorize('admin'), ctrl.update);
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;
