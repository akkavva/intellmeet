const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  meeting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['text', 'file', 'system'],
    default: 'text'
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);