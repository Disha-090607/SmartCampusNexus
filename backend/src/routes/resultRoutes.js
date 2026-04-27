const express = require('express');
const { listResults, publishResult, getMyResults, getStudentResults } = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, authorizeRoles('faculty', 'admin'), listResults);
router.get('/me', protect, authorizeRoles('student'), getMyResults);
router.get('/student/:studentId', protect, authorizeRoles('faculty', 'admin'), getStudentResults);
router.post('/', protect, authorizeRoles('faculty', 'admin'), publishResult);

module.exports = router;
