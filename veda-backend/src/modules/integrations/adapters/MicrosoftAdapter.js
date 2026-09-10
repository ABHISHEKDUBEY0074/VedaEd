const axios = require('axios');
const BaseIntegrationAdapter = require('./BaseIntegrationAdapter');

class MicrosoftAdapter extends BaseIntegrationAdapter {
  constructor(config = {}) {
    super(config);
    this.clientId = process.env.MICROSOFT_CLIENT_ID || config.clientId || '';
    this.clientSecret = process.env.MICROSOFT_CLIENT_SECRET || config.clientSecret || '';
  }

  getMetadata() {
    return {
      name: 'Microsoft 365 & OneDrive',
      slug: 'microsoft',
      category: 'Storage & Documents',
      shortDescription: 'Connect Word, Excel, PowerPoint, and OneDrive school accounts.',
      description: 'Integrate Microsoft 365 to link OneDrive folders, Excel grade templates, Word lesson plans, and PowerPoint classroom presentations.',
      iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
      brandColor: '#00A4EF',
      websiteUrl: 'https://www.microsoft.com/microsoft-365',
      docUrl: 'https://learn.microsoft.com/graph',
      authType: 'oauth2',
      defaultScopes: [
        {
          scope: 'Files.Read.All',
          description: 'Read files in OneDrive and SharePoint',
          isOptional: false,
        },
        {
          scope: 'User.Read',
          description: 'View user profile and sign in',
          isOptional: false,
        },
        {
          scope: 'offline_access',
          description: 'Maintain access to data without signing in repeatedly',
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
      embeddingPolicyNotice: 'Microsoft Office documents open via secure Office 365 Online web deep links.',
      connectionLevel: 'both',
    };
  }

  getAuthorizationUrl({ state, codeChallenge, redirectUri, scopes = [] }) {
    const scopeList = scopes.length > 0
      ? scopes
      : this.getMetadata().defaultScopes.map((s) => s.scope);

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      response_mode: 'query',
      scope: scopeList.join(' '),
      state,
    });

    if (codeChallenge) {
      params.append('code_challenge', codeChallenge);
      params.append('code_challenge_method', 'S256');
    }

    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;
  }

  async handleCallback({ code, codeVerifier, redirectUri }) {
    try {
      const params = new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      });
      if (codeVerifier) params.append('code_verifier', codeVerifier);

      const res = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 10000,
      });

      let accountEmail = '';
      let accountName = '';
      try {
        const userRes = await axios.get('https://graph.microsoft.com/v1.0/me', {
          headers: { Authorization: `Bearer ${res.data.access_token}` },
          timeout: 5000,
        });
        accountEmail = userRes.data.userPrincipalName || userRes.data.mail || '';
        accountName = userRes.data.displayName || 'Microsoft User';
      } catch (e) {}

      return {
        accessToken: res.data.access_token,
        refreshToken: res.data.refresh_token || null,
        tokenType: res.data.token_type || 'Bearer',
        expiresIn: res.data.expires_in || 3600,
        accountEmail,
        accountName,
        metadata: { provider: 'microsoft' },
      };
    } catch (err) {
      throw new Error(`Microsoft OAuth failed: ${err.response?.data?.error_description || err.message}`);
    }
  }

  async refreshAccessToken(refreshToken) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    const res = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 10000,
    });

    return {
      accessToken: res.data.access_token,
      refreshToken: res.data.refresh_token || refreshToken,
      expiresIn: res.data.expires_in || 3600,
    };
  }

  async listResources({ accessToken, query = '', pageToken = '' }) {
    try {
      const url = query
        ? `https://graph.microsoft.com/v1.0/me/drive/root/search(q='${encodeURIComponent(query)}')`
        : 'https://graph.microsoft.com/v1.0/me/drive/root/children';

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { '$top': 25 },
        timeout: 10000,
      });

      const items = (res.data.value || []).map((f) => ({
        id: f.id,
        name: f.name,
        resourceType: f.folder ? 'folder' : 'file',
        mimeType: f.file?.mimeType || 'application/octet-stream',
        sizeBytes: f.size || 0,
        webViewUrl: f.webUrl || '',
        deepLinkUrl: f.webUrl || '',
        modifiedTime: f.lastModifiedDateTime,
      }));

      return { items, nextPageToken: res.data['@odata.nextLink'] || null };
    } catch (err) {
      throw new Error(`Failed to list OneDrive files: ${err.response?.data?.error?.message || err.message}`);
    }
  }

  async getResource({ accessToken, resourceId }) {
    const res = await axios.get(`https://graph.microsoft.com/v1.0/me/drive/items/${encodeURIComponent(resourceId)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 10000,
    });
    const f = res.data;
    return {
      id: f.id,
      name: f.name,
      resourceType: f.folder ? 'folder' : 'file',
      webViewUrl: f.webUrl,
      deepLinkUrl: f.webUrl,
    };
  }
}

module.exports = MicrosoftAdapter;
