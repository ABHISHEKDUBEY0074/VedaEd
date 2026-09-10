const mongoose = require('mongoose');

const oAuthCredentialSchema = new mongoose.Schema(
  {
    connectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IntegrationConnection',
      required: true,
      unique: true,
      index: true,
    },
    // Encrypted access token in hex
    encryptedAccessToken: {
      type: String,
      required: true,
    },
    accessTokenIv: {
      type: String,
      required: true,
    },
    accessTokenTag: {
      type: String,
      required: true,
    },
    // Encrypted refresh token in hex
    encryptedRefreshToken: {
      type: String,
      default: null,
    },
    refreshTokenIv: {
      type: String,
      default: null,
    },
    refreshTokenTag: {
      type: String,
      default: null,
    },
    tokenType: {
      type: String,
      default: 'Bearer',
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
    keyVersion: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OAuthCredential', oAuthCredentialSchema);
