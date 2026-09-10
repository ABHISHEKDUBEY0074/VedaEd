const adapterRegistry = require('./adapters/adapterRegistry');
const IntegrationProvider = require('./models/IntegrationProvider');

/**
 * Seeds or synchronizes built-in integration provider definitions into the MongoDB collection.
 */
async function seedIntegrationProviders() {
  try {
    const allMetadata = adapterRegistry.getAllMetadata();

    for (const meta of allMetadata) {
      await IntegrationProvider.findOneAndUpdate(
        { slug: meta.slug },
        {
          $set: {
            name: meta.name,
            slug: meta.slug,
            category: meta.category,
            description: meta.description,
            shortDescription: meta.shortDescription,
            iconUrl: meta.iconUrl,
            brandColor: meta.brandColor,
            websiteUrl: meta.websiteUrl,
            docUrl: meta.docUrl,
            authType: meta.authType,
            defaultScopes: meta.defaultScopes,
            capabilities: meta.capabilities,
            embeddingSupport: meta.embeddingSupport,
            embeddingPolicyNotice: meta.embeddingPolicyNotice,
            connectionLevel: meta.connectionLevel,
            isBuiltin: true,
          },
          $setOnInsert: {
            isEnabled: true,
          },
        },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Seeded/Synchronized ${allMetadata.length} integration providers.`);
  } catch (err) {
    console.error('Failed to seed integration providers:', err.message);
  }
}

module.exports = seedIntegrationProviders;
