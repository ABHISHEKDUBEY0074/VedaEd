const mongoose = require('mongoose');

const integrationConnectionSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      index: true,
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    providerSlug: {
      type: String,
      required: true,
      index: true,
    },
    connectionLevel: {
      type: String,
      enum: ['user', 'organization'],
      default: 'user',
    },
    status: {
      type: String,
      enum: [
        'AVAILABLE',
        'CONNECTING',
        'CONNECTED',
        'REAUTH_REQUIRED',
        'DISCONNECTED',
        'DISABLED',
        'ERROR',
      ],
      default: 'AVAILABLE',
      index: true,
    },
    scopesGranted: [{
      type: String,
    }],
    accountEmail: {
      type: String,
      trim: true,
      default: '',
    },
    accountName: {
      type: String,
      trim: true,
      default: '',
    },
    accountId: {
      type: String,
      trim: true,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    connectedAt: {
      type: Date,
      default: null,
    },
    lastSyncedAt: {
      type: Date,
      default: null,
    },
    lastError: {
      type: String,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Compound unique index so a user cannot create duplicate active connections to the same provider
integrationConnectionSchema.index(
  { userId: 1, providerSlug: 1, connectionLevel: 1 },
  { unique: true }
);

module.exports = mongoose.model('IntegrationConnection', integrationConnectionSchema);
