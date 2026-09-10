const mongoose = require('mongoose');

const integrationAuditLogSchema = new mongoose.Schema(
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
      index: true,
      default: null,
    },
    providerSlug: {
      type: String,
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'OAUTH_INITIATED',
        'OAUTH_SUCCESS',
        'OAUTH_FAILED',
        'TOKEN_REFRESH_SUCCESS',
        'TOKEN_REFRESH_FAILED',
        'DISCONNECTED',
        'REAUTHORIZED',
        'RESOURCE_LISTED',
        'RESOURCE_IMPORTED',
        'RESOURCE_DELETED',
        'WEBHOOK_RECEIVED',
        'WEBHOOK_PROCESSED',
        'WEBHOOK_FAILED',
        'ADMIN_PROVIDER_ENABLED',
        'ADMIN_PROVIDER_DISABLED',
        'ADMIN_PROVIDER_UPDATED',
      ],
      index: true,
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILURE', 'WARNING', 'INFO'],
      default: 'INFO',
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

integrationAuditLogSchema.index({ schoolId: 1, action: 1, createdAt: -1 });

module.exports = mongoose.model('IntegrationAuditLog', integrationAuditLogSchema);
