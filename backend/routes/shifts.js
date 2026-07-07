const router = require('express').Router();
const ctrl = require('../controllers/shiftController');
const swapCtrl = require('../controllers/shiftSwapController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/swaps',            authenticate, authorize('admin', 'doctor'), swapCtrl.getAll);
router.post('/swaps',           authenticate, authorize('doctor'), swapCtrl.create);
router.put('/swaps/:id/status', authenticate, authorize('admin', 'doctor'), swapCtrl.updateStatus);

router.get('/',                 ctrl.getAll);
router.get('/:staffId',         ctrl.getByStaff);
router.post('/',   authenticate, authorize('admin'), ctrl.create);
router.put('/:id', authenticate, authorize('admin'), ctrl.update);
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;
