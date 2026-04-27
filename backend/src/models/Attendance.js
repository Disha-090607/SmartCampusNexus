const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true, trim: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ['present', 'absent', 'late'],
      required: true
    },
    sessionType: {
      type: String,
      enum: ['lecture', 'lab', 'tutorial'],
      default: 'lecture'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
