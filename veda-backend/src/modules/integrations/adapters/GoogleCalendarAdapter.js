const axios = require('axios');
const BaseIntegrationAdapter = require('./BaseIntegrationAdapter');

class GoogleCalendarAdapter extends BaseIntegrationAdapter {
  constructor(config = {}) {
    super(config);
    this.clientId = process.env.GOOGLE_CLIENT_ID || config.clientId || '';
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET || config.clientSecret || '';
  }

  getMetadata() {
    return {
      name: 'Google Calendar',
      slug: 'google-calendar',
      category: 'Calendar & Scheduling',
      shortDescription: 'Sync academic timetables, exam dates, parent-teacher meetings, and school events.',
      description: 'Synchronize Veda School academic calendars, exams, and class timetables with your personal or school Google Calendar.',
      iconUrl: 'https://ssl.gstatic.com/images/branding/product/2x/calendar_2020q4_48dp.png',
      brandColor: '#4285F4',
      websiteUrl: 'https://calendar.google.com',
      docUrl: 'https://developers.google.com/calendar',
      authType: 'oauth2',
      defaultScopes: [
        {
          scope: 'https://www.googleapis.com/auth/calendar.events.readonly',
          description: 'View events on your calendars',
          isOptional: false,
        },
        {
          scope: 'https://www.googleapis.com/auth/userinfo.email',
          description: 'View your Google account email address',
          isOptional: false,
        },
      ],
      capabilities: [
        'list_resources',
        'get_resource',
        'sync_events',
        'deep_link',
      ],
      embeddingSupport: 'deeplink',
      embeddingPolicyNotice: 'Google Calendar is accessed via native API synchronizations and official calendar deep links.',
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
      access_type: 'offline',
      prompt: 'consent',
      state,
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
      if (codeVerifier) body.code_verifier = codeVerifier;

      const tokenRes = await axios.post('https://oauth2.googleapis.com/token', body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 10000,
      });

      const { access_token, refresh_token, token_type, expires_in } = tokenRes.data;

      let accountEmail = '';
      let accountName = '';
      try {
        const userRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${access_token}` },
          timeout: 5000,
        });
        accountEmail = userRes.data.email || '';
        accountName = userRes.data.name || '';
      } catch (e) {}

      return {
        accessToken: access_token,
        refreshToken: refresh_token || null,
        tokenType: token_type || 'Bearer',
        expiresIn: expires_in || 3600,
        accountEmail,
        accountName,
        metadata: { provider: 'google-calendar' },
      };
    } catch (err) {
      throw new Error(`Google Calendar OAuth failed: ${err.response?.data?.error || err.message}`);
    }
  }

  async refreshAccessToken(refreshToken) {
    const res = await axios.post(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return {
      accessToken: res.data.access_token,
      refreshToken: res.data.refresh_token || refreshToken,
      expiresIn: res.data.expires_in || 3600,
    };
  }

  async listResources({ accessToken, query = '', pageToken = '' }) {
    try {
      const response = await axios.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          q: query || undefined,
          pageToken: pageToken || undefined,
          maxResults: 25,
          timeMin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          singleEvents: true,
          orderBy: 'startTime',
        },
        timeout: 10000,
      });

      const items = (response.data.items || []).map((e) => ({
        id: e.id,
        name: e.summary || '(No Title)',
        resourceType: 'calendar_event',
        mimeType: 'application/vnd.google-apps.event',
        webViewUrl: e.htmlLink || 'https://calendar.google.com',
        deepLinkUrl: e.htmlLink || 'https://calendar.google.com',
        startDate: e.start?.dateTime || e.start?.date,
        endDate: e.end?.dateTime || e.end?.date,
        description: e.description || '',
      }));

      return { items, nextPageToken: response.data.nextPageToken || null };
    } catch (err) {
      throw new Error(`Failed to list calendar events: ${err.response?.data?.error?.message || err.message}`);
    }
  }

  async getResource({ accessToken, resourceId }) {
    const response = await axios.get(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(resourceId)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 10000,
    });
    const e = response.data;
    return {
      id: e.id,
      name: e.summary || '(No Title)',
      resourceType: 'calendar_event',
      webViewUrl: e.htmlLink || 'https://calendar.google.com',
      startDate: e.start?.dateTime || e.start?.date,
      endDate: e.end?.dateTime || e.end?.date,
    };
  }
}

module.exports = GoogleCalendarAdapter;
