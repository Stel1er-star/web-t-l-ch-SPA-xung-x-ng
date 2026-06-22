const router = require('express').Router();
const ctrl = require('../controllers/appointmentController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/',                     ctrl.getAll);
router.get('/my',                   ctrl.getMyAppointments);
router.get('/available-slots',      ctrl.getAvailableSlots);
router.get('/staff/:staffId',       ctrl.getStaffAppointments);
router.get('/:id',                  ctrl.getOne);
router.post('/',    authorize('customer'), ctrl.create);
router.patch('/:id/status',         ctrl.updateStatus);

module.exports = router;
