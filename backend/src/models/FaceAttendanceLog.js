const mongoose = require('mongoose');

const faceAttendanceLogSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String },
    confidence: { type: Number, min: 0, max: 1, default: 0 },
    verified: { type: Boolean, default: false },
    capturedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FaceAttendanceLog', faceAttendanceLogSchema);
