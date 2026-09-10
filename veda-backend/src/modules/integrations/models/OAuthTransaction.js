const mongoose = require('mongoose');

const oAuthTransactionSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    codeVerifier: {
      type: String,
      default: null,
    },
    providerSlug: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      default: null,
    },
    connectionLevel: {
      type: String,
      enum: ['user', 'organization'],
      default: 'user',
    },
    returnUrl: {
      type: String,
      default: '',
    },
    expiresAt: {
      type: Date,
      required: true,
      // MongoDB TTL index to automatically purge expired transactions after 10 minutes
      expires: 0,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OAuthTransaction', oAuthTransactionSchema);
