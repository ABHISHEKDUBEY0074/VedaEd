import config from '../config';
const API_BASE_URL = config.API_BASE_URL;

export const institutionAPI = {
    getInstitution: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/institution`);
            if (!response.ok) throw new Error("Failed to fetch institution");
            return await response.json();
        } catch (error) {
            console.error("Error fetching institution:", error);
            throw error;
        }
    },

    updateInstitution: async (data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/institution`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to update institution");
            }
            return await response.json();
        } catch (error) {
            console.error("Error updating institution:", error);
            throw error;
        }
    },

    uploadAssets: async (formData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/institution/upload-assets`, {
                method: "PATCH",
                body: formData,
            });
            if (!response.ok) throw new Error("Failed to upload assets");
            return await response.json();
        } catch (error) {
            console.error("Error uploading assets:", error);
            throw error;
        }
    }
};
