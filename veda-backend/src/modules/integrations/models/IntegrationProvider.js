const mongoose = require('mongoose');

const integrationProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Storage & Documents', 'Creative & Design', 'Productivity & Notes', 'Communication & Meetings', 'Calendar & Scheduling', 'Developer & Utilities'],
      default: 'Productivity & Notes',
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      default: '',
    },
    iconUrl: {
      type: String,
      default: '',
    },
    brandColor: {
      type: String,
      default: '#4F46E5',
    },
    websiteUrl: {
      type: String,
      default: '',
    },
    docUrl: {
      type: String,
      default: '',
    },
    authType: {
      type: String,
      enum: ['oauth2', 'api_key', 'webhook_only'],
      default: 'oauth2',
    },
    defaultScopes: [{
      scope: { type: String, required: true },
      description: { type: String, required: true },
      isOptional: { type: Boolean, default: false },
    }],
    capabilities: [{
      type: String,
      enum: [
        'list_resources',
        'search_resources',
        'get_resource',
        'import_resource',
        'create_resource',
        'update_resource',
        'delete_resource',
        'export_resource',
        'sync_events',
        'webhooks',
        'deep_link',
      ],
    }],
    embeddingSupport: {
      type: String,
      enum: ['native_api', 'sdk', 'iframe', 'deeplink'],
      default: 'native_api',
    },
    embeddingPolicyNotice: {
      type: String,
      default: '',
    },
    connectionLevel: {
      type: String,
      enum: ['user', 'organization', 'both'],
      default: 'both',
    },
    isEnabled: {
      type: Boolean,
      default: true,
      index: true,
    },
    isBuiltin: {
      type: Boolean,
      default: true,
    },
    customSettings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('IntegrationProvider', integrationProviderSchema);
