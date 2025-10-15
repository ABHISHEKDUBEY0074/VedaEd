const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommunicationLogSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'userModel',
      required: true
    },
    userModel: {
      type: String,
      enum: ['Student', 'Teacher', 'Parent', 'Admin', 'Staff'],
      required: true
    },
    action: {
      type: String,
      enum: [
        'message_sent', 'message_received', 'message_read',
        'notice_viewed', 'notice_created', 'notice_published',
        'complaint_submitted', 'complaint_viewed', 'complaint_responded',
        'file_uploaded', 'file_downloaded', 'login', 'logout'
      ],
      required: true
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'targetModel'
    },
    targetModel: {
      type: String,
      enum: ['Message', 'Notice', 'Complaint', 'User']
    },
    details: {
      type: Schema.Types.Mixed
    },
    ipAddress: String,
    userAgent: String,
    sessionId: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
CommunicationLogSchema.index({ user: 1, timestamp: -1 });
CommunicationLogSchema.index({ action: 1 });
CommunicationLogSchema.index({ timestamp: -1 });
CommunicationLogSchema.index({ userModel: 1 });

const CommunicationLog = mongoose.model("CommunicationLog", CommunicationLogSchema);
module.exports = CommunicationLog;
