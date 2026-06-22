const router = require('express').Router();
const ctrl = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('admin'));

router.get('/dashboard',    ctrl.getDashboardStats);
router.get('/users',        ctrl.getAllUsers);
router.post('/users',       ctrl.createUser);
router.put('/users/:id',    ctrl.updateUser);
router.delete('/users/:id', ctrl.deleteUser);

module.exports = router;
