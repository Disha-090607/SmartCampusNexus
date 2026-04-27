const Result = require('../models/Result');

const listResults = async (req, res) => {
  const query = {};

  if (req.query.studentId) {
    query.student = req.query.studentId;
  }

  const results = await Result.find(query)
    .populate('student', 'name email')
    .populate('publishedBy', 'name email role')
    .sort({ createdAt: -1 });

  return res.json(results);
};

const publishResult = async (req, res) => {
  const created = await Result.create({ ...req.body, publishedBy: req.user._id });
  return res.status(201).json(created);
};

const getMyResults = async (req, res) => {
  const results = await Result.find({ student: req.user._id }).sort({ createdAt: -1 });
  return res.json(results);
};

const getStudentResults = async (req, res) => {
  const { studentId } = req.params;
  const results = await Result.find({ student: studentId }).sort({ createdAt: -1 });
  return res.json(results);
};

module.exports = { listResults, publishResult, getMyResults, getStudentResults };
