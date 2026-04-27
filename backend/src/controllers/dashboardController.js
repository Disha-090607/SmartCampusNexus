const User = require('../models/User');
const Notice = require('../models/Notice');
const Assignment = require('../models/Assignment');
const Complaint = require('../models/Complaint');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');

const getDashboard = async (req, res) => {
  const base = {
    totalUsers: await User.countDocuments(),
    totalNotices: await Notice.countDocuments(),
    totalAssignments: await Assignment.countDocuments(),
    openComplaints: await Complaint.countDocuments({ status: { $in: ['open', 'in-progress'] } })
  };

  if (req.user.role === 'student') {
    const records = await Attendance.find({ student: req.user._id });
    const present = records.filter((r) => r.status !== 'absent').length;
    const attendancePercent = records.length ? Number(((present / records.length) * 100).toFixed(2)) : 0;

    return res.json({
      role: 'student',
      stats: {
        ...base,
        attendancePercent,
        publishedResults: await Result.countDocuments({ student: req.user._id })
      }
    });
  }

  if (req.user.role === 'faculty') {
    return res.json({
      role: 'faculty',
      stats: {
        ...base,
        myAssignments: await Assignment.countDocuments({ faculty: req.user._id })
      }
    });
  }

  return res.json({ role: 'admin', stats: base });
};

module.exports = { getDashboard };
