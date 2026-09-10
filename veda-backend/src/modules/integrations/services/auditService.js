const IntegrationAuditLog = require('../models/IntegrationAuditLog');

/**
 * Audit Service
 * Records structured security and lifecycle events for all third-party integrations.
 * Never logs raw access tokens, passwords, authorization codes, or client secrets.
 */
class AuditService {
  /**
   * Logs an integration action.
   * @param {Object} params
   * @param {string} [params.schoolId]
   * @param {string} [params.userId]
   * @param {string} params.providerSlug
   * @param {string} params.action
   * @param {'SUCCESS'|'FAILURE'|'WARNING'|'INFO'} [params.status='INFO']
   * @param {Object} [params.details={}]
   * @param {Object} [params.req] - Express request for IP / User-Agent capture
   */
  async logEvent({ schoolId, userId, providerSlug, action, status = 'INFO', details = {}, req = null }) {
    try {
      const sanitizedDetails = this._sanitize(details);
      const ipAddress = req?.headers?.['x-forwarded-for'] || req?.socket?.remoteAddress || req?.ip || '';
      const userAgent = req?.headers?.['user-agent'] || '';

      await IntegrationAuditLog.create({
        schoolId: schoolId || null,
        userId: userId || null,
        providerSlug,
        action,
        status,
        details: sanitizedDetails,
        ipAddress: String(ipAddress),
        userAgent: String(userAgent),
      });
    } catch (err) {
      console.error('AuditService: Failed to write audit log:', err.message);
    }
  }

  _sanitize(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    const sanitized = Array.isArray(obj) ? [] : {};
    const sensitiveKeys = ['token', 'accesstoken', 'refreshtoken', 'clientsecret', 'secret', 'password', 'code', 'key'];

    for (const [k, v] of Object.entries(obj)) {
      const lowerKey = k.toLowerCase().replace(/[^a-z]/g, '');
      if (sensitiveKeys.some((s) => lowerKey.includes(s))) {
        sanitized[k] = '[REDACTED]';
      } else if (v && typeof v === 'object') {
        sanitized[k] = this._sanitize(v);
      } else {
        sanitized[k] = v;
      }
    }
    return sanitized;
  }
}

module.exports = new AuditService();
