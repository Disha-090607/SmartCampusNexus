const express = require('express');
const { listMessages, postMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:room', protect, listMessages);
router.post('/:room', protect, postMessage);

module.exports = router;
