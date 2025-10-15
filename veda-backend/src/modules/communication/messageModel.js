const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'senderModel',
      required: true
    },
    senderModel: {
      type: String,
      enum: ['Student', 'Teacher', 'Parent', 'Admin'],
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'receiverModel',
      required: true
    },
    receiverModel: {
      type: String,
      enum: ['Student', 'Teacher', 'Parent', 'Admin'],
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    messageType: {
      type: String,
      enum: ['text', 'file', 'image', 'announcement'],
      default: 'text'
    },
    attachments: [{
      filename: String,
      originalName: String,
      path: String,
      size: Number,
      uploadedAt: { type: Date, default: Date.now }
    }],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read', 'archived'],
      default: 'sent'
    },
    readAt: {
      type: Date
    },
    isImportant: {
      type: Boolean,
      default: false
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    threadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
MessageSchema.index({ sender: 1, createdAt: -1 });
MessageSchema.index({ receiver: 1, createdAt: -1 });
MessageSchema.index({ status: 1 });
MessageSchema.index({ threadId: 1 });

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
