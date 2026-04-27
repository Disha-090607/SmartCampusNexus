const Attendance = require('../models/Attendance');

const markAttendance = async (req, res) => {
  const { records = [] } = req.body;

  if (!records.length) {
    return res.status(400).json({ message: 'records array is required' });
  }

  const docs = records.map((r) => ({
    student: r.student,
    subject: r.subject,
    faculty: req.user._id,
    date: r.date,
    status: r.status,
    sessionType: r.sessionType || 'lecture'
  }));

  const created = await Attendance.insertMany(docs);
  return res.status(201).json(created);
};

const getMyAttendance = async (req, res) => {
  const records = await Attendance.find({ student: req.user._id }).sort({ date: -1 });
  const present = records.filter((r) => r.status !== 'absent').length;
  const percentage = records.length ? Number(((present / records.length) * 100).toFixed(2)) : 0;

  return res.json({
    totalClasses: records.length,
    presentClasses: present,
    percentage,
    records
  });
};

const getStudentAttendance = async (req, res) => {
  const { studentId } = req.params;
  const records = await Attendance.find({ student: studentId }).sort({ date: -1 });
  const present = records.filter((r) => r.status !== 'absent').length;
  const percentage = records.length ? Number(((present / records.length) * 100).toFixed(2)) : 0;

  return res.json({ totalClasses: records.length, presentClasses: present, percentage, records });
};

module.exports = { markAttendance, getMyAttendance, getStudentAttendance };
