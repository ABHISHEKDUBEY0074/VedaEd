/**
 * BaseIntegrationAdapter
 * Abstract contract that all third-party provider adapters must inherit from and implement.
 * Isolates all provider-specific HTTP calls, OAuth flows, and payload formatting.
 */
class BaseIntegrationAdapter {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Returns provider metadata (slug, name, category, default scopes, etc.)
   */
  getMetadata() {
    throw new Error('getMetadata() must be implemented by subclass');
  }

  /**
   * Generates the OAuth 2.0 authorization URL.
   * @param {Object} params
   * @param {string} params.state - Cryptographic anti-CSRF state token
   * @param {string} [params.codeChallenge] - PKCE code challenge
   * @param {string} params.redirectUri - Callback URL
   * @param {string[]} [params.scopes] - Additional requested scopes
   * @returns {string} Fully constructed authorization URL
   */
  getAuthorizationUrl(params) {
    throw new Error('getAuthorizationUrl() must be implemented by subclass');
  }

  /**
   * Exchanges an authorization code for access and refresh tokens.
   * @param {Object} params
   * @param {string} params.code - Authorization code from callback
   * @param {string} [params.codeVerifier] - PKCE code verifier
   * @param {string} params.redirectUri - Registered redirect URI
   * @returns {Promise<{ accessToken: string, refreshToken?: string, tokenType: string, expiresIn: number, accountEmail?: string, accountName?: string, accountId?: string, avatarUrl?: string, metadata?: Object }>}
   */
  async handleCallback(params) {
    throw new Error('handleCallback() must be implemented by subclass');
  }

  /**
   * Refreshes an expired access token using the stored refresh token.
   * @param {string} refreshToken
   * @returns {Promise<{ accessToken: string, refreshToken?: string, expiresIn: number }>}
   */
  async refreshAccessToken(refreshToken) {
    throw new Error('refreshAccessToken() must be implemented by subclass');
  }

  /**
   * Revokes token credentials when user disconnects.
   * @param {string} accessToken
   * @param {string} [refreshToken]
   * @returns {Promise<boolean>}
   */
  async revoke(accessToken, refreshToken) {
    return true; // Default fallback if provider does not require explicit revocation
  }

  /**
   * Returns supported provider capabilities.
   * @returns {string[]}
   */
  getCapabilities() {
    return ['list_resources', 'get_resource', 'import_resource', 'deep_link'];
  }

  /**
   * Lists resources from the third-party provider (e.g. files, designs, pages, events).
   * @param {Object} params
   * @param {string} params.accessToken
   * @param {string} [params.query] - Search term
   * @param {string} [params.pageToken] - Pagination token
   * @param {string} [params.parentId] - Folder or parent container ID
   * @param {number} [params.pageSize] - Number of items to return
   * @returns {Promise<{ items: Array, nextPageToken?: string, totalCount?: number }>}
   */
  async listResources(params) {
    throw new Error('listResources() must be implemented by subclass');
  }

  /**
   * Retrieves single resource metadata.
   * @param {Object} params
   * @param {string} params.accessToken
   * @param {string} params.resourceId
   * @returns {Promise<Object>}
   */
  async getResource(params) {
    throw new Error('getResource() must be implemented by subclass');
  }

  /**
   * Imports or creates a reference of an external resource inside Veda School.
   * @param {Object} params
   * @param {string} params.accessToken
   * @param {string} params.resourceId
   * @param {Object} params.userContext - Information about requesting user/school
   * @returns {Promise<Object>} Normalized external resource object
   */
  async importResource(params) {
    const resource = await this.getResource(params);
    return resource;
  }

  /**
   * Verifies incoming webhook signature.
   * @param {Object} params
   * @param {Object|string} params.payload
   * @param {Object} params.headers
   * @param {string} params.secret
   * @returns {boolean}
   */
  verifyWebhookSignature(params) {
    return true;
  }

  /**
   * Handles webhook event payload and normalizes event.
   * @param {Object} params
   * @param {Object} params.payload
   * @param {Object} params.headers
   * @returns {Promise<{ eventId: string, eventType: string, data: Object }>}
   */
  async handleWebhook(params) {
    return {
      eventId: params.headers['x-event-id'] || `wh-${Date.now()}`,
      eventType: params.headers['x-event-type'] || 'general.event',
      data: params.payload,
    };
  }
}

module.exports = BaseIntegrationAdapter;
