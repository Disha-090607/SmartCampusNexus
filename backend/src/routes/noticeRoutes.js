const express = require('express');
const { createNotice, listNotices, removeNotice } = require('../controllers/noticeController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, listNotices);
router.post('/', protect, authorizeRoles('admin', 'faculty'), createNotice);
router.delete('/:id', protect, authorizeRoles('admin'), removeNotice);

module.exports = router;
