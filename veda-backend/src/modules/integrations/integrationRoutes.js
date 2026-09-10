const express = require('express');
const router = express.Router();
const integrationController = require('./integrationController');
const authMiddleware = require('../../middleware/authMiddleware');

// ==========================================
// PUBLIC CALLBACK & WEBHOOK ENDPOINTS
// ==========================================

// OAuth Provider Callback (browser redirect / popup target)
router.get('/:providerSlug/callback', integrationController.handleOAuthCallback);

// Provider Webhook Receiver
router.post('/webhooks/:providerSlug', integrationController.handleWebhook);
// Also support direct route alias /api/webhooks/:providerSlug if mounted separately
router.post('/:providerSlug/webhook', integrationController.handleWebhook);

// ==========================================
// AUTHENTICATED USER & TENANT ENDPOINTS
// ==========================================

// App Marketplace Discovery
router.get('/marketplace', authMiddleware, integrationController.getMarketplace);
router.get('/providers/:providerSlug', authMiddleware, integrationController.getProviderDetails);

// Initiate OAuth flow
router.post('/:providerSlug/authorize', authMiddleware, integrationController.initiateOAuth);

// Connected Apps Management
router.get('/connections', authMiddleware, integrationController.getConnections);
router.get('/connections/:id', authMiddleware, integrationController.getConnectionById);
router.delete('/connections/:id', authMiddleware, integrationController.disconnectConnection);
router.post('/connections/:id/refresh', authMiddleware, integrationController.refreshToken);

// Resource Explorer & Import System
router.get('/connections/:id/resources', authMiddleware, integrationController.listConnectionResources);
router.get('/connections/:id/resources/:resourceId', authMiddleware, integrationController.getResourceDetails);
router.post('/connections/:id/import', authMiddleware, integrationController.importResource);

// Imported Veda Resources
router.get('/imported-resources', authMiddleware, integrationController.getImportedResources);
router.delete('/imported-resources/:id', authMiddleware, integrationController.deleteImportedResource);

// ==========================================
// ADMIN MANAGEMENT & AUDIT LOGS
// ==========================================

router.get('/admin/providers', authMiddleware, integrationController.getAdminProviders);
router.put('/admin/providers/:providerSlug', authMiddleware, integrationController.updateAdminProvider);
router.get('/admin/audit-logs', authMiddleware, integrationController.getAdminAuditLogs);
router.get('/admin/stats', authMiddleware, integrationController.getAdminStats);

module.exports = router;
