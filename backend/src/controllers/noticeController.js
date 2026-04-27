const Notice = require('../models/Notice');

const createNotice = async (req, res) => {
  const created = await Notice.create({ ...req.body, postedBy: req.user._id });
  return res.status(201).json(created);
};

const listNotices = async (req, res) => {
  const notices = await Notice.find().populate('postedBy', 'name role').sort({ createdAt: -1 });
  return res.json(notices);
};

const removeNotice = async (req, res) => {
  const { id } = req.params;
  const deleted = await Notice.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'Notice not found' });
  return res.json({ message: 'Notice deleted' });
};

module.exports = { createNotice, listNotices, removeNotice };
