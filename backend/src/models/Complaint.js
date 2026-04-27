const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
      type: String,
      enum: ['academic', 'hostel', 'transport', 'discipline', 'other'],
      default: 'other'
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'rejected'],
      default: 'open'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolutionComment: { type: String, trim: true },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);
