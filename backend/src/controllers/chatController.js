const Message = require('../models/Message');

const listMessages = async (req, res) => {
  const { room } = req.params;
  const messages = await Message.find({ room }).populate('sender', 'name role').sort({ createdAt: 1 });
  return res.json(messages);
};

const postMessage = async (req, res) => {
  const { room } = req.params;
  const { content } = req.body;
  const created = await Message.create({ room, content, sender: req.user._id });
  return res.status(201).json(created);
};

module.exports = { listMessages, postMessage };
