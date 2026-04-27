const express = require('express');
const { createSlot, generateBulk, getTimetable } = require('../controllers/timetableController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, getTimetable);
router.post('/', protect, authorizeRoles('admin'), createSlot);
router.post('/generate', protect, authorizeRoles('admin'), generateBulk);

module.exports = router;
