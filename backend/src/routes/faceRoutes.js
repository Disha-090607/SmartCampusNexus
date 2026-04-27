const express = require('express');
const { markFaceAttendance } = require('../controllers/faceController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const upload = require('../utils/upload');

const router = express.Router();

router.post('/attendance', protect, authorizeRoles('student'), upload.single('image'), markFaceAttendance);

module.exports = router;
