const axios = require('axios');
const BaseIntegrationAdapter = require('./BaseIntegrationAdapter');

/**
 * GoogleDriveAdapter
 * Production implementation for Google Drive integration supporting OAuth2,
 * file & folder exploration, search, metadata inspection, deep-link previews,
 * and least-privilege permission management.
 */
class GoogleDriveAdapter extends BaseIntegrationAdapter {
  constructor(config = {}) {
    super(config);
    this.clientId = process.env.GOOGLE_CLIENT_ID || config.clientId || '';
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET || config.clientSecret || '';
  }

  getMetadata() {
    return {
      name: 'Google Drive',
      slug: 'google-drive',
      category: 'Storage & Documents',
      shortDescription: 'Access, search, and link Google Docs, Sheets, Slides, and Drive files.',
      description: 'Connect your Google Drive account to easily attach documents, student assignments, learning resources, and media directly into Veda School.',
      iconUrl: 'https://ssl.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png',
      brandColor: '#4285F4',
      websiteUrl: 'https://drive.google.com',
      docUrl: 'https://developers.google.com/drive',
      authType: 'oauth2',
      defaultScopes: [
        {
          scope: 'https://www.googleapis.com/auth/drive.readonly',
          description: 'View metadata and content of your Google Drive files',
          isOptional: false,
        },
        {
          scope: 'https://www.googleapis.com/auth/userinfo.email',
          description: 'View your Google account email address',
          isOptional: false,
        },
        {
          scope: 'https://www.googleapis.com/auth/userinfo.profile',
          description: 'View your basic profile info (name and avatar)',
          isOptional: false,
        },
      ],
      capabilities: [
        'list_resources',
        'search_resources',
        'get_resource',
        'import_resource',
        'deep_link',
      ],
      embeddingSupport: 'deeplink',
      embeddingPolicyNotice: 'Google Drive prevents embedding arbitrary drive views in iframes due to X-Frame-Options: SAMEORIGIN. Files and documents are opened via secure Google Workspace deep-links or rendered via official preview metadata inside Veda School.',
      connectionLevel: 'both',
    };
  }

  getAuthorizationUrl({ state, codeChallenge, redirectUri, scopes = [] }) {
    const scopeList = scopes.length > 0
      ? scopes
      : this.getMetadata().defaultScopes.map((s) => s.scope);

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scopeList.join(' '),
      access_type: 'offline', // Request refresh token
      prompt: 'consent', // Ensure refresh token is issued
      state,
      include_granted_scopes: 'true',
    });

    if (codeChallenge) {
      params.append('code_challenge', codeChallenge);
      params.append('code_challenge_method', 'S256');
    }

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async handleCallback({ code, codeVerifier, redirectUri }) {
    try {
      const body = {
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      };

      if (codeVerifier) {
        body.code_verifier = codeVerifier;
      }

      const tokenRes = await axios.post('https://oauth2.googleapis.com/token', body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 10000,
      });

      const { access_token, refresh_token, token_type, expires_in } = tokenRes.data;

      // Fetch user profile for display
      let accountEmail = '';
      let accountName = '';
      let accountId = '';
      let avatarUrl = '';

      try {
        const userRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${access_token}` },
          timeout: 5000,
        });
        accountEmail = userRes.data.email || '';
        accountName = userRes.data.name || '';
        accountId = userRes.data.id || '';
        avatarUrl = userRes.data.picture || '';
      } catch (userErr) {
        console.warn('GoogleDriveAdapter: Could not fetch userinfo profile:', userErr.message);
      }

      return {
        accessToken: access_token,
        refreshToken: refresh_token || null,
        tokenType: token_type || 'Bearer',
        expiresIn: expires_in || 3600,
        accountEmail,
        accountName,
        accountId,
        avatarUrl,
        metadata: {
          provider: 'google-drive',
          scopeGranted: tokenRes.data.scope,
        },
      };
    } catch (err) {
      const errorMsg = err.response?.data?.error_description || err.response?.data?.error || err.message;
      throw new Error(`Google OAuth token exchange failed: ${errorMsg}`);
    }
  }

  async refreshAccessToken(refreshToken) {
    try {
      const res = await axios.post(
        'https://oauth2.googleapis.com/token',
        new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }).toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          timeout: 10000,
        }
      );

      return {
        accessToken: res.data.access_token,
        refreshToken: res.data.refresh_token || refreshToken, // Google might not return a new refresh token
        expiresIn: res.data.expires_in || 3600,
      };
    } catch (err) {
      const errorMsg = err.response?.data?.error_description || err.response?.data?.error || err.message;
      throw new Error(`Google token refresh failed: ${errorMsg}`);
    }
  }

  async revoke(accessToken, refreshToken) {
    try {
      const tokenToRevoke = refreshToken || accessToken;
      if (!tokenToRevoke) return true;

      await axios.post(
        `https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(tokenToRevoke)}`,
        null,
        { timeout: 5000 }
      );
      return true;
    } catch (err) {
      console.warn('Google token revocation notice:', err.message);
      return true; // Revocation failure should not block disconnect in Veda
    }
  }

  async listResources({ accessToken, query = '', pageToken = '', parentId = '', pageSize = 20 }) {
    try {
      const qParts = ['trashed = false'];

      if (parentId && parentId !== 'root') {
        qParts.push(`'${parentId}' in parents`);
      } else if (!query) {
        // By default show top level items or root
        qParts.push("'root' in parents");
      }

      if (query && query.trim()) {
        const sanitized = query.replace(/'/g, "\\'");
        qParts.push(`name contains '${sanitized}'`);
      }

      const q = qParts.join(' and ');

      const response = await axios.get('https://www.googleapis.com/drive/v3/files', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          q,
          pageSize: Math.min(pageSize, 50),
          pageToken: pageToken || undefined,
          fields: 'nextPageToken, files(id, name, mimeType, size, webViewLink, webContentLink, iconLink, thumbnailLink, modifiedTime, createdTime, parents, shared)',
          orderBy: 'folder,modifiedTime desc',
        },
        timeout: 10000,
      });

      const items = (response.data.files || []).map((file) => this._normalizeDriveFile(file));

      return {
        items,
        nextPageToken: response.data.nextPageToken || null,
      };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      throw new Error(`Failed to list Google Drive files: ${errorMsg}`);
    }
  }

  async getResource({ accessToken, resourceId }) {
    try {
      const response = await axios.get(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(resourceId)}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          fields: 'id, name, mimeType, size, webViewLink, webContentLink, iconLink, thumbnailLink, modifiedTime, createdTime, owners, parents, description',
        },
        timeout: 10000,
      });

      return this._normalizeDriveFile(response.data);
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      throw new Error(`Failed to get Google Drive file ${resourceId}: ${errorMsg}`);
    }
  }

  async importResource({ accessToken, resourceId, userContext = {} }) {
    const file = await this.getResource({ accessToken, resourceId });
    return {
      externalId: file.id,
      providerSlug: 'google-drive',
      name: file.name,
      resourceType: file.resourceType,
      mimeType: file.mimeType,
      sizeBytes: file.sizeBytes,
      webViewUrl: file.webViewUrl,
      downloadUrl: file.downloadUrl,
      thumbnailUrl: file.thumbnailUrl,
      deepLinkUrl: file.webViewUrl,
      metadata: {
        modifiedTime: file.modifiedTime,
        createdTime: file.createdTime,
        iconLink: file.iconLink,
        isFolder: file.isFolder,
      },
    };
  }

  _normalizeDriveFile(file) {
    const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
    let resourceType = 'file';

    if (isFolder) {
      resourceType = 'folder';
    } else if (file.mimeType?.includes('document') || file.mimeType?.includes('word')) {
      resourceType = 'document';
    } else if (file.mimeType?.includes('spreadsheet') || file.mimeType?.includes('sheet')) {
      resourceType = 'spreadsheet';
    } else if (file.mimeType?.includes('presentation') || file.mimeType?.includes('slides')) {
      resourceType = 'presentation';
    }

    return {
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      sizeBytes: file.size ? parseInt(file.size, 10) : 0,
      resourceType,
      isFolder,
      webViewUrl: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
      downloadUrl: file.webContentLink || '',
      iconLink: file.iconLink || '',
      thumbnailUrl: file.thumbnailLink || '',
      modifiedTime: file.modifiedTime,
      createdTime: file.createdTime,
    };
  }
}

module.exports = GoogleDriveAdapter;
