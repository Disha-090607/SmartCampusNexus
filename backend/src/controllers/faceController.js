const FaceAttendanceLog = require('../models/FaceAttendanceLog');

const markFaceAttendance = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required' });
  }

  const confidence = Number((0.7 + Math.random() * 0.29).toFixed(2));
  const verified = confidence >= 0.8;

  const entry = await FaceAttendanceLog.create({
    student: req.user._id,
    imageUrl: `/uploads/${req.file.filename}`,
    confidence,
    verified
  });

  return res.status(201).json({
    message: 'Face attendance processed (prototype mode)',
    verified,
    confidence,
    entry
  });
};

module.exports = { markFaceAttendance };
