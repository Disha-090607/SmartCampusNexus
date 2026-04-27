const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema(
  {
    courseCode: { type: String, required: true, trim: true },
    courseName: { type: String, required: true, trim: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: String, required: true, trim: true },
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    section: { type: String, required: true },
    semester: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Timetable', timetableSchema);
