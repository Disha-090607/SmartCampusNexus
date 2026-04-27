const express = require('express');
const { askBot } = require('../controllers/chatbotController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/ask', protect, askBot);

module.exports = router;
