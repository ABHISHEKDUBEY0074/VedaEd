const GoogleDriveAdapter = require('./GoogleDriveAdapter');
const GoogleCalendarAdapter = require('./GoogleCalendarAdapter');
const CanvaAdapter = require('./CanvaAdapter');
const NotionAdapter = require('./NotionAdapter');
const ZoomAdapter = require('./ZoomAdapter');
const DropboxAdapter = require('./DropboxAdapter');
const MicrosoftAdapter = require('./MicrosoftAdapter');

/**
 * Adapter Registry
 * Manages instantiated singleton provider adapters and facilitates dynamic lookup.
 */
class AdapterRegistry {
  constructor() {
    this.adapters = new Map();
    this._registerBuiltins();
  }

  _registerBuiltins() {
    this.register(new GoogleDriveAdapter());
    this.register(new GoogleCalendarAdapter());
    this.register(new CanvaAdapter());
    this.register(new NotionAdapter());
    this.register(new ZoomAdapter());
    this.register(new DropboxAdapter());
    this.register(new MicrosoftAdapter());
  }

  /**
   * Registers a provider adapter.
   * @param {import('./BaseIntegrationAdapter')} adapter
   */
  register(adapter) {
    const meta = adapter.getMetadata();
    this.adapters.set(meta.slug.toLowerCase(), adapter);
  }

  /**
   * Retrieves an adapter by provider slug.
   * @param {string} slug
   * @returns {import('./BaseIntegrationAdapter')}
   */
  get(slug) {
    if (!slug) return null;
    return this.adapters.get(slug.toLowerCase()) || null;
  }

  /**
   * Checks if an adapter is registered.
   * @param {string} slug
   * @returns {boolean}
   */
  has(slug) {
    if (!slug) return false;
    return this.adapters.has(slug.toLowerCase());
  }

  /**
   * Returns metadata for all registered adapters.
   * @returns {Array<Object>}
   */
  getAllMetadata() {
    return Array.from(this.adapters.values()).map((a) => a.getMetadata());
  }
}

const registryInstance = new AdapterRegistry();

module.exports = registryInstance;
