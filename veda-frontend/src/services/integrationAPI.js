import api from "./apiClient";

export const integrationAPI = {
  // Discovery & Marketplace
  getMarketplace: (category = "All", search = "") => {
    const params = {};
    if (category && category !== "All") params.category = category;
    if (search && search.trim()) params.search = search.trim();
    return api.get("/integrations/marketplace", { params });
  },

  getProviderDetails: (slug) => {
    return api.get(`/integrations/providers/${slug}`);
  },

  // OAuth Lifecycle
  initiateOAuth: (providerSlug, payload = {}) => {
    return api.post(`/integrations/${providerSlug}/authorize`, payload);
  },

  // Connections
  getConnections: () => {
    return api.get("/integrations/connections");
  },

  getConnectionById: (id) => {
    return api.get(`/integrations/connections/${id}`);
  },

  disconnectConnection: (id) => {
    return api.delete(`/integrations/connections/${id}`);
  },

  refreshToken: (id) => {
    return api.post(`/integrations/connections/${id}/refresh`);
  },

  // Resource Explorer & Import
  getConnectionResources: (id, { query = "", pageToken = "", parentId = "", pageSize = 20 } = {}) => {
    return api.get(`/integrations/connections/${id}/resources`, {
      params: { query, pageToken, parentId, pageSize },
    });
  },

  getResourceDetails: (id, resourceId) => {
    return api.get(`/integrations/connections/${id}/resources/${resourceId}`);
  },

  importResource: (id, resourceId) => {
    return api.post(`/integrations/connections/${id}/import`, { resourceId });
  },

  // Imported Resources
  getImportedResources: ({ providerSlug = "", resourceType = "all", search = "" } = {}) => {
    const params = {};
    if (providerSlug) params.providerSlug = providerSlug;
    if (resourceType && resourceType !== "all") params.resourceType = resourceType;
    if (search && search.trim()) params.search = search.trim();
    return api.get("/integrations/imported-resources", { params });
  },

  deleteImportedResource: (id) => {
    return api.delete(`/integrations/imported-resources/${id}`);
  },

  // Admin & Audit
  getAdminProviders: () => {
    return api.get("/integrations/admin/providers");
  },

  updateAdminProvider: (slug, payload) => {
    return api.put(`/integrations/admin/providers/${slug}`, payload);
  },

  getAdminAuditLogs: (params = {}) => {
    return api.get("/integrations/admin/audit-logs", { params });
  },

  getAdminStats: () => {
    return api.get("/integrations/admin/stats");
  },
};

export default integrationAPI;
