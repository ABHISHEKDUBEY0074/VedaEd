const crypto = require('crypto');
const adapterRegistry = require('../adapters/adapterRegistry');
const tokenCryptoService = require('./tokenCryptoService');
const auditService = require('./auditService');
const IntegrationConnection = require('../models/IntegrationConnection');
const OAuthCredential = require('../models/OAuthCredential');
const OAuthTransaction = require('../models/OAuthTransaction');
const IntegrationProvider = require('../models/IntegrationProvider');

/**
 * Centralized OAuth Management Service
 * Handles authorization URL generation, PKCE verification, state token validation,
 * token exchange, encrypted credential storage, and automatic token refresh.
 */
class OAuthService {
  /**
   * Helper to generate base64url encoded string without padding.
   */
  _base64Url(buffer) {
    return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  /**
   * Generates PKCE code_verifier and code_challenge (S256).
   */
  _generatePKCE() {
    const codeVerifier = this._base64Url(crypto.randomBytes(32));
    const hash = crypto.createHash('sha256').update(codeVerifier).digest();
    const codeChallenge = this._base64Url(hash);
    return { codeVerifier, codeChallenge };
  }

  /**
   * Initiates the OAuth flow for a provider.
   * @param {Object} params
   * @param {string} params.userId
   * @param {string} [params.schoolId]
   * @param {string} params.providerSlug
   * @param {'user'|'organization'} [params.connectionLevel='user']
   * @param {string} params.redirectUri
   * @param {string} [params.returnUrl]
   * @param {string[]} [params.scopes]
   * @param {Object} [params.req]
   * @returns {Promise<{ authorizationUrl: string, state: string }>}
   */
  async initiateOAuth({ userId, schoolId, providerSlug, connectionLevel = 'user', redirectUri, returnUrl = '', scopes = [], req = null }) {
    const adapter = adapterRegistry.get(providerSlug);
    if (!adapter) {
      throw new Error(`Unsupported integration provider: ${providerSlug}`);
    }

    // Verify provider is enabled in system
    const providerDoc = await IntegrationProvider.findOne({ slug: providerSlug });
    if (providerDoc && !providerDoc.isEnabled) {
      throw new Error(`Provider '${providerSlug}' is currently disabled by administrator.`);
    }

    // Generate cryptographic state token
    const state = this._base64Url(crypto.randomBytes(24));
    const { codeVerifier, codeChallenge } = this._generatePKCE();

    // 10 minutes expiry for OAuth state
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OAuthTransaction.create({
      state,
      codeVerifier,
      providerSlug,
      userId,
      schoolId: schoolId || null,
      connectionLevel,
      returnUrl,
      expiresAt,
    });

    // Update connection status to CONNECTING
    await IntegrationConnection.findOneAndUpdate(
      { userId, providerSlug, connectionLevel },
      {
        $set: {
          schoolId: schoolId || null,
          status: 'CONNECTING',
          lastError: null,
        },
      },
      { upsert: true }
    );

    const authorizationUrl = adapter.getAuthorizationUrl({
      state,
      codeChallenge,
      redirectUri,
      scopes,
    });

    await auditService.logEvent({
      schoolId,
      userId,
      providerSlug,
      action: 'OAUTH_INITIATED',
      status: 'INFO',
      details: { connectionLevel, returnUrl },
      req,
    });

    return { authorizationUrl, state };
  }

  /**
   * Handles the provider OAuth callback.
   * @param {Object} params
   * @param {string} params.state
   * @param {string} params.code
   * @param {string} params.redirectUri
   * @param {Object} [params.req]
   * @returns {Promise<{ connection: Object, returnUrl: string }>}
   */
  async handleCallback({ state, code, redirectUri, req = null }) {
    // 1. Validate state transaction
    const transaction = await OAuthTransaction.findOne({ state });
    if (!transaction) {
      throw new Error('Invalid or expired OAuth state token. Please restart authorization.');
    }

    const { userId, schoolId, providerSlug, connectionLevel, codeVerifier, returnUrl } = transaction;

    // Delete one-time transaction immediately to prevent replay
    await OAuthTransaction.deleteOne({ _id: transaction._id });

    const adapter = adapterRegistry.get(providerSlug);
    if (!adapter) {
      throw new Error(`Adapter not found for provider: ${providerSlug}`);
    }

    try {
      // 2. Exchange authorization code with provider
      const tokenResult = await adapter.handleCallback({
        code,
        codeVerifier,
        redirectUri,
      });

      const {
        accessToken,
        refreshToken,
        tokenType = 'Bearer',
        expiresIn = 3600,
        accountEmail = '',
        accountName = '',
        accountId = '',
        avatarUrl = '',
        metadata = {},
      } = tokenResult;

      // 3. Encrypt access and refresh tokens using AES-256-GCM
      const encryptedAccess = tokenCryptoService.encrypt(accessToken);
      const encryptedRefresh = refreshToken ? tokenCryptoService.encrypt(refreshToken) : null;

      const expiresAt = new Date(Date.now() + expiresIn * 1000);

      // 4. Update or create IntegrationConnection record
      const connection = await IntegrationConnection.findOneAndUpdate(
        { userId, providerSlug, connectionLevel },
        {
          $set: {
            schoolId: schoolId || null,
            status: 'CONNECTED',
            accountEmail,
            accountName,
            accountId,
            avatarUrl,
            connectedAt: new Date(),
            lastSyncedAt: new Date(),
            lastError: null,
            metadata,
          },
        },
        { upsert: true, new: true }
      );

      // 5. Store encrypted credentials in OAuthCredential
      await OAuthCredential.findOneAndUpdate(
        { connectionId: connection._id },
        {
          $set: {
            encryptedAccessToken: encryptedAccess.encrypted,
            accessTokenIv: encryptedAccess.iv,
            accessTokenTag: encryptedAccess.tag,
            encryptedRefreshToken: encryptedRefresh ? encryptedRefresh.encrypted : undefined,
            refreshTokenIv: encryptedRefresh ? encryptedRefresh.iv : undefined,
            refreshTokenTag: encryptedRefresh ? encryptedRefresh.tag : undefined,
            tokenType,
            expiresAt,
            keyVersion: 1,
          },
        },
        { upsert: true }
      );

      await auditService.logEvent({
        schoolId,
        userId,
        providerSlug,
        action: 'OAUTH_SUCCESS',
        status: 'SUCCESS',
        details: { accountEmail, accountName, accountId },
        req,
      });

      return {
        connection: {
          id: connection._id,
          providerSlug: connection.providerSlug,
          status: connection.status,
          accountEmail: connection.accountEmail,
          accountName: connection.accountName,
          connectedAt: connection.connectedAt,
        },
        returnUrl: returnUrl || '',
      };
    } catch (err) {
      // Mark connection in ERROR state
      await IntegrationConnection.findOneAndUpdate(
        { userId, providerSlug, connectionLevel },
        {
          $set: {
            status: 'ERROR',
            lastError: err.message,
          },
        }
      );

      await auditService.logEvent({
        schoolId,
        userId,
        providerSlug,
        action: 'OAUTH_FAILED',
        status: 'FAILURE',
        details: { error: err.message },
        req,
      });

      throw err;
    }
  }

  /**
   * Retrieves a valid decrypted access token for a connection, automatically refreshing if expired.
   * @param {string} connectionId
   * @returns {Promise<{ accessToken: string, connection: Object }>}
   */
  async getValidAccessToken(connectionId) {
    const connection = await IntegrationConnection.findById(connectionId);
    if (!connection) {
      throw new Error('Integration connection not found.');
    }

    if (connection.status !== 'CONNECTED' && connection.status !== 'REAUTH_REQUIRED') {
      throw new Error(`Connection is in '${connection.status}' state. Please reconnect.`);
    }

    const credential = await OAuthCredential.findOne({ connectionId });
    if (!credential) {
      throw new Error('OAuth credentials missing for this connection.');
    }

    const adapter = adapterRegistry.get(connection.providerSlug);
    if (!adapter) {
      throw new Error(`Adapter not registered for: ${connection.providerSlug}`);
    }

    const now = new Date();
    // Check if token expires within 5 minutes (300,000 ms)
    const isExpiredOrSoon = credential.expiresAt && (credential.expiresAt.getTime() - now.getTime() < 300000);

    if (isExpiredOrSoon && credential.encryptedRefreshToken) {
      try {
        const decryptedRefresh = tokenCryptoService.decrypt(
          credential.encryptedRefreshToken,
          credential.refreshTokenIv,
          credential.refreshTokenTag
        );

        const refreshed = await adapter.refreshAccessToken(decryptedRefresh);
        const newEncryptedAccess = tokenCryptoService.encrypt(refreshed.accessToken);
        const newEncryptedRefresh = refreshed.refreshToken
          ? tokenCryptoService.encrypt(refreshed.refreshToken)
          : null;

        const newExpiresAt = new Date(Date.now() + (refreshed.expiresIn || 3600) * 1000);

        credential.encryptedAccessToken = newEncryptedAccess.encrypted;
        credential.accessTokenIv = newEncryptedAccess.iv;
        credential.accessTokenTag = newEncryptedAccess.tag;
        if (newEncryptedRefresh) {
          credential.encryptedRefreshToken = newEncryptedRefresh.encrypted;
          credential.refreshTokenIv = newEncryptedRefresh.iv;
          credential.refreshTokenTag = newEncryptedRefresh.tag;
        }
        credential.expiresAt = newExpiresAt;
        await credential.save();

        connection.status = 'CONNECTED';
        connection.lastSyncedAt = new Date();
        connection.lastError = null;
        await connection.save();

        await auditService.logEvent({
          schoolId: connection.schoolId,
          userId: connection.userId,
          providerSlug: connection.providerSlug,
          action: 'TOKEN_REFRESH_SUCCESS',
          status: 'SUCCESS',
        });

        return { accessToken: refreshed.accessToken, connection };
      } catch (refreshErr) {
        connection.status = 'REAUTH_REQUIRED';
        connection.lastError = `Auto-refresh failed: ${refreshErr.message}`;
        await connection.save();

        await auditService.logEvent({
          schoolId: connection.schoolId,
          userId: connection.userId,
          providerSlug: connection.providerSlug,
          action: 'TOKEN_REFRESH_FAILED',
          status: 'WARNING',
          details: { error: refreshErr.message },
        });

        throw new Error('Access token expired and refresh failed. Please reauthorize the connection.');
      }
    }

    const decryptedAccess = tokenCryptoService.decrypt(
      credential.encryptedAccessToken,
      credential.accessTokenIv,
      credential.accessTokenTag
    );

    return { accessToken: decryptedAccess, connection };
  }

  /**
   * Disconnects and deletes credentials for a connection.
   * @param {Object} params
   * @param {string} params.connectionId
   * @param {string} params.userId
   * @param {string} [params.schoolId]
   * @param {boolean} [params.isAdmin=false]
   * @param {Object} [params.req]
   */
  async disconnectConnection({ connectionId, userId, schoolId, isAdmin = false, req = null }) {
    const query = { _id: connectionId };
    if (!isAdmin) {
      query.userId = userId;
    }

    const connection = await IntegrationConnection.findOne(query);
    if (!connection) {
      throw new Error('Connection not found or insufficient permission.');
    }

    const credential = await OAuthCredential.findOne({ connectionId: connection._id });
    if (credential) {
      const adapter = adapterRegistry.get(connection.providerSlug);
      if (adapter) {
        try {
          const decryptedAccess = tokenCryptoService.decrypt(
            credential.encryptedAccessToken,
            credential.accessTokenIv,
            credential.accessTokenTag
          );
          const decryptedRefresh = credential.encryptedRefreshToken
            ? tokenCryptoService.decrypt(
                credential.encryptedRefreshToken,
                credential.refreshTokenIv,
                credential.refreshTokenTag
              )
            : null;

          await adapter.revoke(decryptedAccess, decryptedRefresh);
        } catch (revokeErr) {
          console.warn('OAuthService: Revocation warning:', revokeErr.message);
        }
      }

      await OAuthCredential.deleteOne({ _id: credential._id });
    }

    connection.status = 'DISCONNECTED';
    connection.accountEmail = '';
    connection.accountName = '';
    connection.lastSyncedAt = null;
    connection.lastError = null;
    await connection.save();

    await auditService.logEvent({
      schoolId: connection.schoolId,
      userId: connection.userId,
      providerSlug: connection.providerSlug,
      action: 'DISCONNECTED',
      status: 'INFO',
      details: { disconnectedBy: userId },
      req,
    });

    return { success: true, message: `Successfully disconnected ${connection.providerSlug}` };
  }
}

module.exports = new OAuthService();
