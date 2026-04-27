const Timetable = require('../models/Timetable');
const { detectConflicts } = require('../services/timetableService');

const createSlot = async (req, res) => {
  const payload = { ...req.body, createdBy: req.user._id };
  const conflicts = await detectConflicts(payload);

  if (conflicts.length) {
    return res.status(409).json({ message: 'Conflict detected', conflicts });
  }

  const created = await Timetable.create(payload);
  return res.status(201).json(created);
};

const generateBulk = async (req, res) => {
  const { slots = [] } = req.body;
  const accepted = [];
  const rejected = [];

  for (const slot of slots) {
    const payload = { ...slot, createdBy: req.user._id };
    const conflicts = await detectConflicts(payload);

    if (conflicts.length) {
      rejected.push({ slot, conflicts });
      continue;
    }

    const created = await Timetable.create(payload);
    accepted.push(created);
  }

  return res.status(201).json({ accepted, rejected });
};

const getTimetable = async (req, res) => {
  const { semester, section } = req.query;
  const filter = {};

  if (req.user.role === 'faculty') {
    filter.faculty = req.user._id;
  }

  if (req.user.role === 'student') {
    if (req.user.semester) {
      filter.semester = Number(req.user.semester);
    }
  }

  if (semester) filter.semester = Number(semester);
  if (section) filter.section = section;

  const data = await Timetable.find(filter).populate('faculty', 'name email');
  return res.json(data);
};

module.exports = { createSlot, generateBulk, getTimetable };
