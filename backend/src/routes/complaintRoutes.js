const express = require('express');
const { raiseComplaint, listComplaints, updateComplaint, assignComplaint } = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, listComplaints);
router.post('/', protect, raiseComplaint);
router.put('/:id', protect, authorizeRoles('faculty', 'admin'), updateComplaint);
router.put('/:id/assign', protect, authorizeRoles('admin'), assignComplaint);

module.exports = router;
