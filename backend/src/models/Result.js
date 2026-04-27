const mongoose = require('mongoose');

const resultItemSchema = new mongoose.Schema(
  {
    subjectCode: { type: String, required: true },
    subjectName: { type: String, required: true },
    marks: { type: Number, required: true },
    maxMarks: { type: Number, default: 100 },
    grade: { type: String, required: true }
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    semester: { type: Number, required: true },
    examType: { type: String, required: true },
    items: [resultItemSchema],
    gpa: { type: Number, min: 0, max: 10 },
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Result', resultSchema);
