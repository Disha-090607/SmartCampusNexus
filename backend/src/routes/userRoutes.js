const express = require('express');
const { listUsers, updateUserRole, createUserByAdmin } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, authorizeRoles('admin'), listUsers);
router.post('/', protect, authorizeRoles('admin'), createUserByAdmin);
router.put('/:id/role', protect, authorizeRoles('admin'), updateUserRole);

module.exports = router;