const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
