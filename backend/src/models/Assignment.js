const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    dueDate: { type: Date, required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    attachmentUrls: [{ type: String }],
    target: {
      semester: { type: Number },
      section: { type: String },
      department: { type: String }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
