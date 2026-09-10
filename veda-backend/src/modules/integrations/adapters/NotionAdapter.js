const axios = require('axios');
const BaseIntegrationAdapter = require('./BaseIntegrationAdapter');

class NotionAdapter extends BaseIntegrationAdapter {
  constructor(config = {}) {
    super(config);
    this.clientId = process.env.NOTION_CLIENT_ID || config.clientId || '';
    this.clientSecret = process.env.NOTION_CLIENT_SECRET || config.clientSecret || '';
  }

  getMetadata() {
    return {
      name: 'Notion',
      slug: 'notion',
      category: 'Productivity & Notes',
      shortDescription: 'Connect school wikis, syllabus docs, staff meeting notes, and knowledge bases.',
      description: 'Connect Notion workspaces to link collaborative curriculum plans, lesson databases, institutional policies, and staff documentation inside Veda School.',
      iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg',
      brandColor: '#000000',
      websiteUrl: 'https://www.notion.so',
      docUrl: 'https://developers.notion.com',
      authType: 'oauth2',
      defaultScopes: [
        {
          scope: 'read_content',
          description: 'Read pages and databases selected by user in Notion workspace',
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
      embeddingPolicyNotice: 'Notion pages are accessed via the Notion API search index and official Notion deep links in compliance with Notion workspace security.',
      connectionLevel: 'both',
    };
  }

  getAuthorizationUrl({ state, redirectUri }) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      owner: 'user',
      state,
    });
    return `https://api.notion.com/v1/oauth/authorize?${params.toString()}`;
  }

  async handleCallback({ code, redirectUri }) {
    try {
      const authHeader = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      const res = await axios.post(
        'https://api.notion.com/v1/oauth/token',
        {
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
        },
        {
          headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28',
          },
          timeout: 10000,
        }
      );

      return {
        accessToken: res.data.access_token,
        refreshToken: null, // Notion tokens are long-lived unless revoked
        tokenType: res.data.token_type || 'Bearer',
        expiresIn: 315360000, // 10 years
        accountName: res.data.workspace_name || 'Notion Workspace',
        accountId: res.data.workspace_id || res.data.bot_id || '',
        avatarUrl: res.data.workspace_icon || '',
        metadata: {
          workspaceName: res.data.workspace_name,
          workspaceId: res.data.workspace_id,
          botId: res.data.bot_id,
        },
      };
    } catch (err) {
      throw new Error(`Notion OAuth exchange failed: ${err.response?.data?.message || err.message}`);
    }
  }

  async refreshAccessToken(refreshToken) {
    return { accessToken: refreshToken, expiresIn: 315360000 };
  }

  async listResources({ accessToken, query = '', pageToken = '' }) {
    try {
      const res = await axios.post(
        'https://api.notion.com/v1/search',
        {
          query: query || undefined,
          start_cursor: pageToken || undefined,
          page_size: 20,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      const items = (res.data.results || []).map((item) => {
        let title = 'Untitled Notion Page';
        if (item.properties?.title?.title?.[0]?.plain_text) {
          title = item.properties.title.title[0].plain_text;
        } else if (item.properties?.Name?.title?.[0]?.plain_text) {
          title = item.properties.Name.title[0].plain_text;
        }

        return {
          id: item.id,
          name: title,
          resourceType: item.object === 'database' ? 'database' : 'page',
          mimeType: 'application/vnd.notion.page',
          webViewUrl: item.url || `https://www.notion.so/${item.id.replace(/-/g, '')}`,
          deepLinkUrl: item.url || `https://www.notion.so/${item.id.replace(/-/g, '')}`,
          createdTime: item.created_time,
          modifiedTime: item.last_edited_time,
          iconLink: item.icon?.emoji || item.icon?.external?.url || '',
        };
      });

      return { items, nextPageToken: res.data.next_cursor || null };
    } catch (err) {
      throw new Error(`Failed to list Notion pages: ${err.response?.data?.message || err.message}`);
    }
  }

  async getResource({ accessToken, resourceId }) {
    const res = await axios.get(`https://api.notion.com/v1/pages/${encodeURIComponent(resourceId)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Notion-Version': '2022-06-28',
      },
      timeout: 10000,
    });
    return {
      id: res.data.id,
      name: 'Notion Page',
      resourceType: 'page',
      webViewUrl: res.data.url,
      deepLinkUrl: res.data.url,
    };
  }
}

module.exports = NotionAdapter;
