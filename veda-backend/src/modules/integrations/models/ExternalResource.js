const mongoose = require('mongoose');

const externalResourceSchema = new mongoose.Schema(
  {
    connectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IntegrationConnection',
      required: true,
      index: true,
    },
    providerSlug: {
      type: String,
      required: true,
      index: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      index: true,
      default: null,
    },
    importedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    externalId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    resourceType: {
      type: String,
      enum: ['file', 'folder', 'document', 'spreadsheet', 'presentation', 'design', 'page', 'meeting', 'calendar_event', 'other'],
      default: 'file',
    },
    mimeType: {
      type: String,
      default: 'application/octet-stream',
    },
    sizeBytes: {
      type: Number,
      default: 0,
    },
    webViewUrl: {
      type: String,
      default: '',
    },
    downloadUrl: {
      type: String,
      default: '',
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    deepLinkUrl: {
      type: String,
      default: '',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ['active', 'archived', 'deleted'],
      default: 'active',
    },
    importedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index for quick resource lookup per school/user
externalResourceSchema.index({ schoolId: 1, providerSlug: 1, externalId: 1 });
externalResourceSchema.index({ importedBy: 1, providerSlug: 1 });

module.exports = mongoose.model('ExternalResource', externalResourceSchema);
