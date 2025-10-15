const mongoose = require("mongoose");
const { Schema } = mongoose;

const ComplaintSchema = new Schema(
  {
    complainant: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'complainantModel',
      required: true
    },
    complainantModel: {
      type: String,
      enum: ['Student', 'Teacher', 'Parent'],
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['academic', 'behavioral', 'infrastructure', 'staff', 'other'],
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'in_progress', 'resolved', 'closed', 'rejected'],
      default: 'submitted'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'assignedToModel'
    },
    assignedToModel: {
      type: String,
      enum: ['Teacher', 'Admin']
    },
    attachments: [{
      filename: String,
      originalName: String,
      path: String,
      size: Number,
      uploadedAt: { type: Date, default: Date.now }
    }],
    responses: [{
      responder: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'responses.responderModel',
        required: true
      },
      responderModel: {
        type: String,
        enum: ['Teacher', 'Admin'],
        required: true
      },
      response: {
        type: String,
        required: true
      },
      responseDate: {
        type: Date,
        default: Date.now
      },
      isInternal: {
        type: Boolean,
        default: false
      }
    }],
    resolution: {
      description: String,
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'resolution.resolvedByModel'
      },
      resolvedByModel: {
        type: String,
        enum: ['Teacher', 'Admin']
      },
      resolvedAt: Date,
      resolutionType: {
        type: String,
        enum: ['resolved', 'dismissed', 'escalated']
      }
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    relatedComplaints: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint'
    }],
    tags: [String],
    dueDate: Date
  },
  { timestamps: true }
);

// Indexes for better query performance
ComplaintSchema.index({ complainant: 1, createdAt: -1 });
ComplaintSchema.index({ status: 1 });
ComplaintSchema.index({ category: 1 });
ComplaintSchema.index({ assignedTo: 1 });
ComplaintSchema.index({ priority: 1 });

const Complaint = mongoose.model("Complaint", ComplaintSchema);
module.exports = Complaint;
