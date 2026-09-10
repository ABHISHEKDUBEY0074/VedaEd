const adapterRegistry = require('../adapters/adapterRegistry');
const WebhookEvent = require('../models/WebhookEvent');
const auditService = require('./auditService');
const tokenCryptoService = require('./tokenCryptoService');

/**
 * Webhook Ingestion & Processing Service
 * Provides signature verification, event deduplication, retry tracking,
 * and reliable asynchronous event processing.
 */
class WebhookService {
  /**
   * Ingests an incoming webhook from an external provider.
   * @param {Object} params
   * @param {string} params.providerSlug
   * @param {Object|string} params.payload
   * @param {Object} params.headers
   * @param {string} [params.rawBody]
   * @param {Object} [params.req]
   * @returns {Promise<{ success: boolean, eventId: string, status: string }>}
   */
  async ingestWebhook({ providerSlug, payload, headers, rawBody, req = null }) {
    const adapter = adapterRegistry.get(providerSlug);
    if (!adapter) {
      throw new Error(`Unsupported webhook provider: ${providerSlug}`);
    }

    // 1. Resolve webhook secret for provider if configured
    const webhookSecret = process.env[`${providerSlug.toUpperCase().replace(/-/g, '_')}_WEBHOOK_SECRET`] || process.env.WEBHOOK_SECRET || '';

    // 2. Normalize event via adapter
    const normalized = await adapter.handleWebhook({
      payload,
      headers,
      rawBody,
    });

    const { eventId, eventType, data } = normalized;

    // 3. Verify signature if secret configured
    let signatureValid = true;
    if (webhookSecret) {
      signatureValid = adapter.verifyWebhookSignature({
        payload: rawBody || payload,
        headers,
        secret: webhookSecret,
      });

      if (!signatureValid) {
        await auditService.logEvent({
          providerSlug,
          action: 'WEBHOOK_FAILED',
          status: 'WARNING',
          details: { error: 'Invalid webhook signature', eventId, eventType },
          req,
        });
        throw new Error('Invalid webhook signature');
      }
    }

    // 4. Deduplication & Idempotency check
    const existingEvent = await WebhookEvent.findOne({ providerSlug, eventId });
    if (existingEvent) {
      return {
        success: true,
        eventId,
        status: existingEvent.status,
        message: 'Duplicate event acknowledged (idempotent)',
      };
    }

    // 5. Store pending webhook event
    const webhookDoc = await WebhookEvent.create({
      providerSlug,
      eventId,
      eventType,
      payload: data || payload,
      headers: { ...headers, authorization: undefined }, // strip auth headers
      signature: headers['x-signature'] || headers['x-hub-signature'] || '',
      signatureValid,
      status: 'PENDING',
    });

    // 6. Process asynchronously without blocking response
    this._processEventAsync(webhookDoc._id, providerSlug, eventType, data || payload).catch((err) => {
      console.error('Webhook async error:', err.message);
    });

    await auditService.logEvent({
      providerSlug,
      action: 'WEBHOOK_RECEIVED',
      status: 'INFO',
      details: { eventId, eventType },
      req,
    });

    return {
      success: true,
      eventId,
      status: 'ACCEPTED',
    };
  }

  async _processEventAsync(webhookId, providerSlug, eventType, data) {
    try {
      const webhookDoc = await WebhookEvent.findById(webhookId);
      if (!webhookDoc) return;

      // Event processing logic: e.g. calendar sync, file update notifications, etc.
      webhookDoc.status = 'PROCESSED';
      webhookDoc.processedAt = new Date();
      await webhookDoc.save();

      await auditService.logEvent({
        providerSlug,
        action: 'WEBHOOK_PROCESSED',
        status: 'SUCCESS',
        details: { eventId: webhookDoc.eventId, eventType },
      });
    } catch (err) {
      const webhookDoc = await WebhookEvent.findById(webhookId);
      if (webhookDoc) {
        webhookDoc.retryCount += 1;
        webhookDoc.lastError = err.message;
        webhookDoc.status = webhookDoc.retryCount >= webhookDoc.maxRetries ? 'FAILED' : 'PENDING';
        await webhookDoc.save();
      }

      await auditService.logEvent({
        providerSlug,
        action: 'WEBHOOK_FAILED',
        status: 'FAILURE',
        details: { error: err.message },
      });
    }
  }
}

module.exports = new WebhookService();
