const { getCampusBotReply } = require('../services/chatbotService');

const askBot = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'message is required' });

  const reply = await getCampusBotReply(message);
  return res.json({ reply });
};

module.exports = { askBot };
