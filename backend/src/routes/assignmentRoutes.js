const express = require('express');
const {
  createAssignment,
  listAssignments,
  submitAssignment,
  gradeSubmission,
  listSubmissions
} = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const upload = require('../utils/upload');

const router = express.Router();

router.get('/', protect, listAssignments);
router.post('/', protect, authorizeRoles('faculty', 'admin'), upload.array('files', 5), createAssignment);
router.get('/:assignmentId/submissions', protect, authorizeRoles('faculty', 'admin'), listSubmissions);
router.post('/:assignmentId/submit', protect, authorizeRoles('student'), upload.array('files', 5), submitAssignment);
router.put('/submissions/:submissionId/grade', protect, authorizeRoles('faculty', 'admin'), gradeSubmission);

module.exports = router;
