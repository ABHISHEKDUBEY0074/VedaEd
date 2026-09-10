const axios = require('axios');
const BaseIntegrationAdapter = require('./BaseIntegrationAdapter');

class CanvaAdapter extends BaseIntegrationAdapter {
  constructor(config = {}) {
    super(config);
    this.clientId = process.env.CANVA_CLIENT_ID || config.clientId || '';
    this.clientSecret = process.env.CANVA_CLIENT_SECRET || config.clientSecret || '';
  }

  getMetadata() {
    return {
      name: 'Canva',
      slug: 'canva',
      category: 'Creative & Design',
      shortDescription: 'Design certificates, posters, lesson plans, and classroom visual assets.',
      description: 'Connect Canva to seamlessly create, import, and link school design templates, student report graphics, event banners, and certificate designs.',
      iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg',
      brandColor: '#00C4CC',
      websiteUrl: 'https://www.canva.com',
      docUrl: 'https://www.canva.dev',
      authType: 'oauth2',
      defaultScopes: [
        {
          scope: 'design:read',
          description: 'View metadata and previews of your Canva designs',
          isOptional: false,
        },
        {
          scope: 'design:content:read',
          description: 'Export and download completed designs into Veda School',
          isOptional: false,
        },
        {
          scope: 'profile:read',
          description: 'View basic Canva profile information',
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
      embeddingPolicyNotice: 'Canva requires designs to be edited via the official Canva Editor deep link or the Canva Connect Button SDK in compliance with Canva Platform Security Policies.',
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
      state,
      code_challenge: codeChallenge || state,
      code_challenge_method: 'S256',
    });

    return `https://www.canva.com/api/oauth/authorize?${params.toString()}`;
  }

  async handleCallback({ code, codeVerifier, redirectUri }) {
    try {
      const authHeader = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code_verifier: codeVerifier || '',
        code,
        redirect_uri: redirectUri,
      });

      const res = await axios.post('https://api.canva.com/rest/v1/oauth/token', params.toString(), {
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
        expiresIn: res.data.expires_in || 3600,
        accountName: 'Canva Workspace',
        metadata: { provider: 'canva' },
      };
    } catch (err) {
      throw new Error(`Canva OAuth exchange failed: ${err.response?.data?.message || err.message}`);
    }
  }

  async refreshAccessToken(refreshToken) {
    const authHeader = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    const res = await axios.post('https://api.canva.com/rest/v1/oauth/token', params.toString(), {
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
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
      const res = await axios.get('https://api.canva.com/rest/v1/designs', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          continuation: pageToken || undefined,
          query: query || undefined,
        },
        timeout: 10000,
      });

      const items = (res.data.items || []).map((d) => ({
        id: d.id,
        name: d.title || 'Untitled Canva Design',
        resourceType: 'design',
        mimeType: 'application/vnd.canva.design',
        thumbnailUrl: d.thumbnail?.url || '',
        webViewUrl: d.urls?.edit_url || d.urls?.view_url || 'https://www.canva.com',
        deepLinkUrl: d.urls?.edit_url || 'https://www.canva.com',
        createdTime: d.created_at ? new Date(d.created_at * 1000).toISOString() : null,
        modifiedTime: d.updated_at ? new Date(d.updated_at * 1000).toISOString() : null,
      }));

      return { items, nextPageToken: res.data.continuation || null };
    } catch (err) {
      throw new Error(`Failed to list Canva designs: ${err.response?.data?.message || err.message}`);
    }
  }

  async getResource({ accessToken, resourceId }) {
    const res = await axios.get(`https://api.canva.com/rest/v1/designs/${encodeURIComponent(resourceId)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 10000,
    });
    const d = res.data.design;
    return {
      id: d.id,
      name: d.title || 'Untitled Canva Design',
      resourceType: 'design',
      thumbnailUrl: d.thumbnail?.url || '',
      webViewUrl: d.urls?.view_url || 'https://www.canva.com',
      deepLinkUrl: d.urls?.edit_url || 'https://www.canva.com',
    };
  }
}

module.exports = CanvaAdapter;
