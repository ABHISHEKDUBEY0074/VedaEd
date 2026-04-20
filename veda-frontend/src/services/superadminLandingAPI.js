import config from "../config";

const parseResponse = async (response, fallbackMessage) => {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message || fallbackMessage);
  }
  return payload;
};

export const superadminLandingAPI = {
  getProfile: async () => {
    const response = await fetch(`${config.API_BASE_URL}/superadmin-landing/profile`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return parseResponse(response, "Failed to fetch profile");
  },

  updateProfile: async (data) => {
    const response = await fetch(`${config.API_BASE_URL}/superadmin-landing/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return parseResponse(response, "Failed to update profile");
  },

  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append("logo", file);

    const response = await fetch(`${config.API_BASE_URL}/superadmin-landing/profile/logo`, {
      method: "PATCH",
      body: formData,
    });
    return parseResponse(response, "Failed to upload logo");
  },

  getTheme: async () => {
    const response = await fetch(`${config.API_BASE_URL}/superadmin-landing/theme`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return parseResponse(response, "Failed to fetch theme");
  },

  updateTheme: async (data) => {
    const response = await fetch(`${config.API_BASE_URL}/superadmin-landing/theme`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return parseResponse(response, "Failed to update theme");
  },

  getOther: async () => {
    const response = await fetch(`${config.API_BASE_URL}/superadmin-landing/other`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return parseResponse(response, "Failed to fetch other settings");
  },

  updateOther: async (data) => {
    const response = await fetch(`${config.API_BASE_URL}/superadmin-landing/other`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return parseResponse(response, "Failed to update other settings");
  },
};
