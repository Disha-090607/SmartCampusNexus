const express = require('express');
const {
  markAttendance,
  getMyAttendance,
  getStudentAttendance
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/me', protect, authorizeRoles('student'), getMyAttendance);
router.get('/student/:studentId', protect, authorizeRoles('faculty', 'admin'), getStudentAttendance);
router.post('/mark', protect, authorizeRoles('faculty', 'admin'), markAttendance);

module.exports = router;
