const axios = require('axios');
const BaseIntegrationAdapter = require('./BaseIntegrationAdapter');

class ZoomAdapter extends BaseIntegrationAdapter {
  constructor(config = {}) {
    super(config);
    this.clientId = process.env.ZOOM_CLIENT_ID || config.clientId || '';
    this.clientSecret = process.env.ZOOM_CLIENT_SECRET || config.clientSecret || '';
  }

  getMetadata() {
    return {
      name: 'Zoom Meetings',
      slug: 'zoom',
      category: 'Communication & Meetings',
      shortDescription: 'Host live online classes, parent-teacher conferences, and staff meetings.',
      description: 'Integrate Zoom to schedule, start, and manage live video classrooms, virtual admissions, and staff webinars directly within Veda School.',
      iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg',
      brandColor: '#2D8CFF',
      websiteUrl: 'https://zoom.us',
      docUrl: 'https://developers.zoom.us',
      authType: 'oauth2',
      defaultScopes: [
        {
          scope: 'meeting:read:list_meetings',
          description: 'View scheduled Zoom meetings',
          isOptional: false,
        },
        {
          scope: 'user:read:user',
          description: 'View Zoom account user profile',
          isOptional: false,
        },
      ],
      capabilities: [
        'list_resources',
        'get_resource',
        'create_resource',
        'deep_link',
      ],
      embeddingSupport: 'deeplink',
      embeddingPolicyNotice: 'Zoom live meetings launch via native Zoom Client deep links or web browser participant links according to Zoom security specifications.',
      connectionLevel: 'both',
    };
  }

  getAuthorizationUrl({ state, redirectUri }) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: redirectUri,
      state,
    });
    return `https://zoom.us/oauth/authorize?${params.toString()}`;
  }

  async handleCallback({ code, redirectUri }) {
    try {
      const authHeader = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      });

      const res = await axios.post('https://zoom.us/oauth/token', params.toString(), {
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000,
      });

      let accountEmail = '';
      let accountName = '';
      try {
        const userRes = await axios.get('https://api.zoom.us/v2/users/me', {
          headers: { Authorization: `Bearer ${res.data.access_token}` },
          timeout: 5000,
        });
        accountEmail = userRes.data.email || '';
        accountName = `${userRes.data.first_name || ''} ${userRes.data.last_name || ''}`.trim() || 'Zoom User';
      } catch (e) {}

      return {
        accessToken: res.data.access_token,
        refreshToken: res.data.refresh_token || null,
        tokenType: res.data.token_type || 'Bearer',
        expiresIn: res.data.expires_in || 3600,
        accountEmail,
        accountName,
        metadata: { provider: 'zoom' },
      };
    } catch (err) {
      throw new Error(`Zoom OAuth exchange failed: ${err.response?.data?.message || err.message}`);
    }
  }

  async refreshAccessToken(refreshToken) {
    const authHeader = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    const res = await axios.post('https://zoom.us/oauth/token', params.toString(), {
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

  async listResources({ accessToken, pageToken = '' }) {
    try {
      const res = await axios.get('https://api.zoom.us/v2/users/me/meetings', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          type: 'upcoming',
          page_size: 30,
          next_page_token: pageToken || undefined,
        },
        timeout: 10000,
      });

      const items = (res.data.meetings || []).map((m) => ({
        id: String(m.id),
        name: m.topic || 'Zoom Meeting',
        resourceType: 'meeting',
        mimeType: 'application/vnd.zoom.meeting',
        webViewUrl: m.join_url || 'https://zoom.us',
        deepLinkUrl: m.start_url || m.join_url || 'https://zoom.us',
        startDate: m.start_time,
        description: `Duration: ${m.duration} mins, Timezone: ${m.timezone}`,
      }));

      return { items, nextPageToken: res.data.next_page_token || null };
    } catch (err) {
      throw new Error(`Failed to list Zoom meetings: ${err.response?.data?.message || err.message}`);
    }
  }

  async getResource({ accessToken, resourceId }) {
    const res = await axios.get(`https://api.zoom.us/v2/meetings/${encodeURIComponent(resourceId)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 10000,
    });
    const m = res.data;
    return {
      id: String(m.id),
      name: m.topic || 'Zoom Meeting',
      resourceType: 'meeting',
      webViewUrl: m.join_url,
      deepLinkUrl: m.join_url,
    };
  }
}

module.exports = ZoomAdapter;
