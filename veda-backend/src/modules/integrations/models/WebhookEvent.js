const mongoose = require('mongoose');

const webhookEventSchema = new mongoose.Schema(
  {
    providerSlug: {
      type: String,
      required: true,
      index: true,
    },
    eventId: {
      type: String,
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    headers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    signature: {
      type: String,
      default: '',
    },
    signatureValid: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSED', 'FAILED', 'IGNORED'],
      default: 'PENDING',
      index: true,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    maxRetries: {
      type: Number,
      default: 3,
    },
    lastError: {
      type: String,
      default: null,
    },
    processedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Idempotency constraint: avoid duplicate processing of the same provider event
webhookEventSchema.index({ providerSlug: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('WebhookEvent', webhookEventSchema);
