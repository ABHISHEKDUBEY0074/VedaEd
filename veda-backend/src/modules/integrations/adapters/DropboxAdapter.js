const axios = require('axios');
const BaseIntegrationAdapter = require('./BaseIntegrationAdapter');

class DropboxAdapter extends BaseIntegrationAdapter {
  constructor(config = {}) {
    super(config);
    this.clientId = process.env.DROPBOX_CLIENT_ID || config.clientId || '';
    this.clientSecret = process.env.DROPBOX_CLIENT_SECRET || config.clientSecret || '';
  }

  getMetadata() {
    return {
      name: 'Dropbox',
      slug: 'dropbox',
      category: 'Storage & Documents',
      shortDescription: 'Store, share, and backup student portfolios and large media files.',
      description: 'Connect Dropbox to sync student submissions, multimedia assets, school archive records, and lesson content.',
      iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg',
      brandColor: '#0061FF',
      websiteUrl: 'https://www.dropbox.com',
      docUrl: 'https://www.dropbox.com/developers',
      authType: 'oauth2',
      defaultScopes: [
        {
          scope: 'files.metadata.read',
          description: 'View file metadata and folder structure',
          isOptional: false,
        },
        {
          scope: 'files.content.read',
          description: 'Read file contents to attach and import into Veda',
          isOptional: false,
        },
        {
          scope: 'account_info.read',
          description: 'View basic Dropbox account profile',
          isOptional: false,
        },
      ],
      capabilities: [
        'list_resources',
        'get_resource',
        'import_resource',
        'deep_link',
      ],
      embeddingSupport: 'deeplink',
      embeddingPolicyNotice: 'Dropbox files are previewed via Dropbox shared link deep views and normalized metadata.',
      connectionLevel: 'both',
    };
  }

  getAuthorizationUrl({ state, redirectUri }) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      token_access_type: 'offline',
      redirect_uri: redirectUri,
      state,
    });
    return `https://www.dropbox.com/oauth2/authorize?${params.toString()}`;
  }

  async handleCallback({ code, redirectUri }) {
    try {
      const authHeader = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      const params = new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      });

      const res = await axios.post('https://api.dropboxapi.com/oauth2/token', params.toString(), {
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000,
      });

      return {
        accessToken: res.data.access_token,
        refreshToken: res.data.refresh_token || null,
        tokenType: res.data.token_type || 'Bearer',
        expiresIn: res.data.expires_in || 14400,
        accountId: res.data.account_id || '',
        metadata: { provider: 'dropbox' },
      };
    } catch (err) {
      throw new Error(`Dropbox OAuth failed: ${err.response?.data?.error_description || err.message}`);
    }
  }

  async refreshAccessToken(refreshToken) {
    const authHeader = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    const res = await axios.post('https://api.dropboxapi.com/oauth2/token', params.toString(), {
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 10000,
    });

    return {
      accessToken: res.data.access_token,
      refreshToken: res.data.refresh_token || refreshToken,
      expiresIn: res.data.expires_in || 14400,
    };
  }

  async listResources({ accessToken, query = '', pageToken = '', parentId = '' }) {
    try {
      const endpoint = pageToken
        ? 'https://api.dropboxapi.com/2/files/list_folder/continue'
        : 'https://api.dropboxapi.com/2/files/list_folder';

      const body = pageToken
        ? { cursor: pageToken }
        : { path: parentId || '', recursive: false, limit: 25 };

      const res = await axios.post(endpoint, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      const items = (res.data.entries || []).map((e) => ({
        id: e.id,
        name: e.name,
        resourceType: e['.tag'] === 'folder' ? 'folder' : 'file',
        mimeType: 'application/octet-stream',
        sizeBytes: e.size || 0,
        webViewUrl: `https://www.dropbox.com/home${e.path_display || ''}`,
        deepLinkUrl: `https://www.dropbox.com/home${e.path_display || ''}`,
        modifiedTime: e.server_modified || null,
      }));

      return { items, nextPageToken: res.data.has_more ? res.data.cursor : null };
    } catch (err) {
      throw new Error(`Failed to list Dropbox files: ${err.response?.data?.error_summary || err.message}`);
    }
  }

  async getResource({ accessToken, resourceId }) {
    const res = await axios.post(
      'https://api.dropboxapi.com/2/files/get_metadata',
      { path: resourceId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );
    const e = res.data;
    return {
      id: e.id,
      name: e.name,
      resourceType: e['.tag'] === 'folder' ? 'folder' : 'file',
      webViewUrl: `https://www.dropbox.com/home${e.path_display || ''}`,
      deepLinkUrl: `https://www.dropbox.com/home${e.path_display || ''}`,
    };
  }
}

module.exports = DropboxAdapter;
