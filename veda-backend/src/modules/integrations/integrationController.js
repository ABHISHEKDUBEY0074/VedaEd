const IntegrationProvider = require('./models/IntegrationProvider');
const IntegrationConnection = require('./models/IntegrationConnection');
const ExternalResource = require('./models/ExternalResource');
const IntegrationAuditLog = require('./models/IntegrationAuditLog');
const oauthService = require('./services/oauthService');
const webhookService = require('./services/webhookService');
const auditService = require('./services/auditService');
const adapterRegistry = require('./adapters/adapterRegistry');

/**
 * Helper to resolve user context from req.user
 */
function resolveUserContext(req) {
  const userId = req.user?.userId || req.user?._id;
  const schoolId = req.user?.schoolId || req.schoolId || null;
  const role = req.user?.role || 'admin';
  return { userId, schoolId, role };
}

// ==========================================
// MARKETPLACE & PROVIDER DISCOVERY
// ==========================================

exports.getMarketplace = async (req, res) => {
  try {
    const { userId, schoolId, role } = resolveUserContext(req);
    const { category, search } = req.query;

    // Ensure built-in providers are seeded in DB
    const totalInDb = await IntegrationProvider.countDocuments();
    if (totalInDb === 0) {
      const seedIntegrationProviders = require('./seedProviders');
      await seedIntegrationProviders();
    }

    const filter = { isEnabled: { $ne: false } };
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { shortDescription: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const providers = await IntegrationProvider.find(filter).sort({ name: 1 }).lean();

    // Query active connections for this user / school
    const connections = await IntegrationConnection.find({
      $or: [
        { userId },
        ...(schoolId ? [{ schoolId, connectionLevel: 'organization' }] : []),
      ],
    }).lean();

    const connectionMap = new Map();
    for (const c of connections) {
      connectionMap.set(c.providerSlug, c);
    }

    const enriched = providers.map((p) => {
      const conn = connectionMap.get(p.slug);
      return {
        ...p,
        connection: conn
          ? {
              id: conn._id,
              status: conn.status,
              accountEmail: conn.accountEmail,
              accountName: conn.accountName,
              avatarUrl: conn.avatarUrl,
              connectedAt: conn.connectedAt,
              lastSyncedAt: conn.lastSyncedAt,
              lastError: conn.lastError,
              connectionLevel: conn.connectionLevel,
            }
          : null,
      };
    });

    res.status(200).json({
      success: true,
      data: enriched,
      count: enriched.length,
    });
  } catch (err) {
    console.error('getMarketplace error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProviderDetails = async (req, res) => {
  try {
    const { providerSlug } = req.params;
    const { userId, schoolId } = resolveUserContext(req);

    const provider = await IntegrationProvider.findOne({ slug: providerSlug }).lean();
    if (!provider) {
      return res.status(404).json({ success: false, message: `Provider '${providerSlug}' not found` });
    }

    const connection = await IntegrationConnection.findOne({
      providerSlug,
      $or: [{ userId }, ...(schoolId ? [{ schoolId, connectionLevel: 'organization' }] : [])],
    }).lean();

    res.status(200).json({
      success: true,
      data: {
        ...provider,
        connection: connection || null,
      },
    });
  } catch (err) {
    console.error('getProviderDetails error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// OAUTH LIFECYCLE
// ==========================================

exports.initiateOAuth = async (req, res) => {
  try {
    const { providerSlug } = req.params;
    const { connectionLevel = 'user', returnUrl = '', scopes = [] } = req.body;
    const { userId, schoolId } = resolveUserContext(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Default redirect URI
    const baseUrl = process.env.API_BASE_URL || `${req.protocol}://${req.get('host')}/api`;
    const redirectUri = `${baseUrl}/integrations/${providerSlug}/callback`;

    const result = await oauthService.initiateOAuth({
      userId,
      schoolId,
      providerSlug,
      connectionLevel,
      redirectUri,
      returnUrl,
      scopes,
      req,
    });

    res.status(200).json({
      success: true,
      data: {
        authorizationUrl: result.authorizationUrl,
        state: result.state,
      },
    });
  } catch (err) {
    console.error('initiateOAuth error:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.handleOAuthCallback = async (req, res) => {
  try {
    const { providerSlug } = req.params;
    const { code, state, error, error_description } = req.query;

    if (error) {
      const errorMsg = error_description || error;
      return res.send(`
        <!DOCTYPE html>
        <html>
          <head><title>OAuth Failed</title></head>
          <body style="font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #FFF5F5;">
            <div style="text-align: center; max-width: 450px; padding: 32px; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <h2 style="color: #E53E3E; margin-bottom: 8px;">Authorization Declined</h2>
              <p style="color: #4A5568; font-size: 14px;">${errorMsg}</p>
              <button onclick="window.close()" style="margin-top: 16px; padding: 8px 16px; background: #E2E8F0; border: none; border-radius: 6px; cursor: pointer;">Close Window</button>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'VEDA_OAUTH_FAILURE', error: '${errorMsg}' }, '*');
              }
            </script>
          </body>
        </html>
      `);
    }

    if (!code || !state) {
      return res.status(400).send('Missing code or state parameters');
    }

    const baseUrl = process.env.API_BASE_URL || `${req.protocol}://${req.get('host')}/api`;
    const redirectUri = `${baseUrl}/integrations/${providerSlug}/callback`;

    const { connection, returnUrl } = await oauthService.handleCallback({
      state,
      code,
      redirectUri,
      req,
    });

    // Render completion page with postMessage communication for popup or redirect back to app
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Connection Successful</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #F0FDF4;">
          <div style="text-align: center; max-width: 420px; padding: 32px; background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08);">
            <div style="width: 56px; height: 56px; background: #DCFCE7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto;">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 style="color: #15803D; margin-bottom: 8px; font-size: 20px;">Connected Successfully!</h2>
            <p style="color: #4B5563; font-size: 14px; margin-bottom: 20px;">Your ${providerSlug} account has been securely linked to Veda School.</p>
            <p style="color: #9CA3AF; font-size: 12px;">This window will close automatically...</p>
          </div>
          <script>
            try {
              if (window.opener) {
                window.opener.postMessage({
                  type: 'VEDA_OAUTH_SUCCESS',
                  providerSlug: '${providerSlug}',
                  connection: ${JSON.stringify(connection)}
                }, '*');
                setTimeout(function() { window.close(); }, 1200);
              } else {
                window.location.href = '${returnUrl || '/admin/integrations'}';
              }
            } catch(e) {
              window.location.href = '${returnUrl || '/admin/integrations'}';
            }
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('handleOAuthCallback error:', err);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <body style="font-family: system-ui; text-align: center; padding: 50px;">
          <h2 style="color: #DC2626;">Integration Error</h2>
          <p>${err.message}</p>
          <button onclick="window.close()" style="padding: 8px 16px;">Close</button>
        </body>
      </html>
    `);
  }
};

// ==========================================
// CONNECTED APPS MANAGEMENT
// ==========================================

exports.getConnections = async (req, res) => {
  try {
    const { userId, schoolId } = resolveUserContext(req);

    const connections = await IntegrationConnection.find({
      $or: [{ userId }, ...(schoolId ? [{ schoolId, connectionLevel: 'organization' }] : [])],
    }).sort({ connectedAt: -1 }).lean();

    const providerSlugs = connections.map((c) => c.providerSlug);
    const providers = await IntegrationProvider.find({ slug: { $in: providerSlugs } }).lean();
    const providerMap = new Map(providers.map((p) => [p.slug, p]));

    const enriched = connections.map((c) => ({
      ...c,
      provider: providerMap.get(c.providerSlug) || null,
    }));

    res.status(200).json({
      success: true,
      data: enriched,
    });
  } catch (err) {
    console.error('getConnections error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getConnectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, schoolId, role } = resolveUserContext(req);

    const query = { _id: id };
    if (role !== 'superadmin' && role !== 'admin') {
      query.userId = userId;
    }

    const connection = await IntegrationConnection.findOne(query).lean();
    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection not found' });
    }

    const provider = await IntegrationProvider.findOne({ slug: connection.providerSlug }).lean();

    res.status(200).json({
      success: true,
      data: {
        ...connection,
        provider,
      },
    });
  } catch (err) {
    console.error('getConnectionById error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.disconnectConnection = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, schoolId, role } = resolveUserContext(req);

    const isAdmin = role === 'superadmin' || role === 'admin';
    const result = await oauthService.disconnectConnection({
      connectionId: id,
      userId,
      schoolId,
      isAdmin,
      req,
    });

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    console.error('disconnectConnection error:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await oauthService.getValidAccessToken(id);

    res.status(200).json({
      success: true,
      message: 'Token validated and refreshed successfully',
      status: result.connection.status,
      lastSyncedAt: result.connection.lastSyncedAt,
    });
  } catch (err) {
    console.error('refreshToken error:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// ==========================================
// RESOURCE SYSTEM & EXPLORER
// ==========================================

exports.listConnectionResources = async (req, res) => {
  try {
    const { id } = req.params;
    const { query = '', pageToken = '', parentId = '', pageSize = 20 } = req.query;

    const { accessToken, connection } = await oauthService.getValidAccessToken(id);
    const adapter = adapterRegistry.get(connection.providerSlug);
    if (!adapter) {
      return res.status(400).json({ success: false, message: `Adapter not found for ${connection.providerSlug}` });
    }

    const resources = await adapter.listResources({
      accessToken,
      query: String(query),
      pageToken: String(pageToken),
      parentId: String(parentId),
      pageSize: parseInt(pageSize, 10) || 20,
    });

    await auditService.logEvent({
      schoolId: connection.schoolId,
      userId: connection.userId,
      providerSlug: connection.providerSlug,
      action: 'RESOURCE_LISTED',
      status: 'INFO',
      details: { query, parentId, count: resources.items?.length || 0 },
      req,
    });

    res.status(200).json({
      success: true,
      data: resources.items || [],
      nextPageToken: resources.nextPageToken || null,
    });
  } catch (err) {
    console.error('listConnectionResources error:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getResourceDetails = async (req, res) => {
  try {
    const { id, resourceId } = req.params;

    const { accessToken, connection } = await oauthService.getValidAccessToken(id);
    const adapter = adapterRegistry.get(connection.providerSlug);
    if (!adapter) {
      return res.status(400).json({ success: false, message: `Adapter not found for ${connection.providerSlug}` });
    }

    const resource = await adapter.getResource({
      accessToken,
      resourceId,
    });

    res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (err) {
    console.error('getResourceDetails error:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.importResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { resourceId } = req.body;
    const { userId, schoolId } = resolveUserContext(req);

    if (!resourceId) {
      return res.status(400).json({ success: false, message: 'resourceId is required in body' });
    }

    const { accessToken, connection } = await oauthService.getValidAccessToken(id);
    const adapter = adapterRegistry.get(connection.providerSlug);
    if (!adapter) {
      return res.status(400).json({ success: false, message: `Adapter not found for ${connection.providerSlug}` });
    }

    const importedData = await adapter.importResource({
      accessToken,
      resourceId,
      userContext: { userId, schoolId },
    });

    // Check if resource is already imported
    const existing = await ExternalResource.findOne({
      schoolId: schoolId || null,
      providerSlug: connection.providerSlug,
      externalId: importedData.externalId,
    });

    let savedDoc;
    if (existing) {
      existing.name = importedData.name;
      existing.webViewUrl = importedData.webViewUrl;
      existing.downloadUrl = importedData.downloadUrl;
      existing.thumbnailUrl = importedData.thumbnailUrl;
      existing.metadata = importedData.metadata;
      existing.status = 'active';
      savedDoc = await existing.save();
    } else {
      savedDoc = await ExternalResource.create({
        connectionId: connection._id,
        providerSlug: connection.providerSlug,
        schoolId: schoolId || null,
        importedBy: userId,
        externalId: importedData.externalId,
        name: importedData.name,
        resourceType: importedData.resourceType,
        mimeType: importedData.mimeType,
        sizeBytes: importedData.sizeBytes,
        webViewUrl: importedData.webViewUrl,
        downloadUrl: importedData.downloadUrl,
        thumbnailUrl: importedData.thumbnailUrl,
        deepLinkUrl: importedData.deepLinkUrl,
        metadata: importedData.metadata,
      });
    }

    await auditService.logEvent({
      schoolId,
      userId,
      providerSlug: connection.providerSlug,
      action: 'RESOURCE_IMPORTED',
      status: 'SUCCESS',
      details: { externalId: importedData.externalId, name: importedData.name },
      req,
    });

    res.status(201).json({
      success: true,
      data: savedDoc,
      message: 'Resource successfully imported into Veda School',
    });
  } catch (err) {
    console.error('importResource error:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getImportedResources = async (req, res) => {
  try {
    const { userId, schoolId } = resolveUserContext(req);
    const { providerSlug, resourceType, search } = req.query;

    const filter = {
      $or: [{ importedBy: userId }, ...(schoolId ? [{ schoolId }] : [])],
      status: 'active',
    };

    if (providerSlug) filter.providerSlug = providerSlug;
    if (resourceType && resourceType !== 'all') filter.resourceType = resourceType;
    if (search && search.trim()) {
      filter.name = { $regex: search.trim(), $options: 'i' };
    }

    const resources = await ExternalResource.find(filter)
      .sort({ importedAt: -1 })
      .populate('importedBy', 'name email')
      .lean();

    res.status(200).json({
      success: true,
      data: resources,
      count: resources.length,
    });
  } catch (err) {
    console.error('getImportedResources error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteImportedResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, schoolId, role } = resolveUserContext(req);

    const query = { _id: id };
    if (role !== 'admin' && role !== 'superadmin') {
      query.importedBy = userId;
    }

    const doc = await ExternalResource.findOneAndDelete(query);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Imported resource not found or unauthorized' });
    }

    await auditService.logEvent({
      schoolId,
      userId,
      providerSlug: doc.providerSlug,
      action: 'RESOURCE_DELETED',
      status: 'INFO',
      details: { resourceId: id, name: doc.name },
      req,
    });

    res.status(200).json({
      success: true,
      message: 'Resource removed successfully',
    });
  } catch (err) {
    console.error('deleteImportedResource error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// WEBHOOKS
// ==========================================

exports.handleWebhook = async (req, res) => {
  try {
    const { providerSlug } = req.params;
    const payload = req.body;
    const headers = req.headers;

    const result = await webhookService.ingestWebhook({
      providerSlug,
      payload,
      headers,
      req,
    });

    res.status(200).json(result);
  } catch (err) {
    console.error('handleWebhook error:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// ==========================================
// ADMIN CONTROLS & AUDIT LOGS
// ==========================================

exports.getAdminProviders = async (req, res) => {
  try {
    const totalInDb = await IntegrationProvider.countDocuments();
    if (totalInDb === 0) {
      const seedIntegrationProviders = require('./seedProviders');
      await seedIntegrationProviders();
    }
    const providers = await IntegrationProvider.find().sort({ name: 1 }).lean();
    res.status(200).json({ success: true, data: providers });
  } catch (err) {
    console.error('getAdminProviders error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateAdminProvider = async (req, res) => {
  try {
    const { providerSlug } = req.params;
    const { isEnabled, defaultScopes, customSettings } = req.body;
    const { userId, schoolId } = resolveUserContext(req);

    const updateFields = {};
    if (typeof isEnabled === 'boolean') updateFields.isEnabled = isEnabled;
    if (defaultScopes) updateFields.defaultScopes = defaultScopes;
    if (customSettings) updateFields.customSettings = customSettings;

    const updated = await IntegrationProvider.findOneAndUpdate(
      { slug: providerSlug },
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    await auditService.logEvent({
      schoolId,
      userId,
      providerSlug,
      action: isEnabled ? 'ADMIN_PROVIDER_ENABLED' : 'ADMIN_PROVIDER_DISABLED',
      status: 'INFO',
      details: updateFields,
      req,
    });

    res.status(200).json({ success: true, data: updated, message: 'Provider updated successfully' });
  } catch (err) {
    console.error('updateAdminProvider error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAdminAuditLogs = async (req, res) => {
  try {
    const { schoolId } = resolveUserContext(req);
    const { providerSlug, action, status, limit = 50, page = 1 } = req.query;

    const query = {};
    if (schoolId) query.schoolId = schoolId;
    if (providerSlug) query.providerSlug = providerSlug;
    if (action) query.action = action;
    if (status) query.status = status;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const logs = await IntegrationAuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .populate('userId', 'name email role')
      .lean();

    const total = await IntegrationAuditLog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: logs,
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / parseInt(limit, 10)),
    });
  } catch (err) {
    console.error('getAdminAuditLogs error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const { schoolId } = resolveUserContext(req);
    const scopeQuery = schoolId ? { schoolId } : {};

    const [totalConnections, activeConnections, importedCount, recentLogs] = await Promise.all([
      IntegrationConnection.countDocuments(scopeQuery),
      IntegrationConnection.countDocuments({ ...scopeQuery, status: 'CONNECTED' }),
      ExternalResource.countDocuments({ ...(schoolId ? { schoolId } : {}), status: 'active' }),
      IntegrationAuditLog.find(scopeQuery).sort({ createdAt: -1 }).limit(10).populate('userId', 'name email').lean(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalConnections,
        activeConnections,
        importedCount,
        recentActivity: recentLogs,
      },
    });
  } catch (err) {
    console.error('getAdminStats error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
