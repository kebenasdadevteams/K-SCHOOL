const express = require('express');
const { createUser, getAllUsers, getUserById, updateUserRoles, deleteUser } = require('../controllers/user-controller');
const { authenticate } = require('../middleware/auth-middleware');
const { requireRole } = require('../middleware/role-middleware');

const router = express.Router();

router.use(authenticate);

router.post('/', requireRole('admin'), createUser);
router.get('/', requireRole('admin'), getAllUsers);
router.get('/:id', requireRole('admin'), getUserById);
router.put('/:id/roles', requireRole('admin'), updateUserRoles);
router.delete('/:id', requireRole('admin'), deleteUser);

module.exports = router;
