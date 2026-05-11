const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  meetingCode: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'active', 'ended'],
    default: 'scheduled'
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  recording: {
    type: String,
    default: ''
  },
  transcript: {
    type: String,
    default: ''
  },
  summary: {
    type: String,
    default: ''
  },
  actionItems: [{
    task: String,
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completed: {
      type: Boolean,
      default: false
    }
  }]
}, { timestamps: true });

// Generate unique meeting code before saving
meetingSchema.pre('save', function() {
  if (!this.meetingCode) {
    this.meetingCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
});

module.exports = mongoose.model('Meeting', meetingSchema);