import api from './apiClient';

export const parentAPI = {
    getAllParents: async () => {
        try {
            const response = await api.get('/parents');
            return response.data;
        } catch (error) {
            console.error('Error fetching parents:', error);
            throw error;
        }
    },
    getParentById: async (id) => {
        try {
            const response = await api.get(`/parents/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching parent:', error);
            throw error;
        }
    },
    uploadProfilePhoto: async (id, file) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.post(`/parents/${id}/profile-photo`, formData);
        return response.data;
    },
    updateParent: async (id, data) => {
        try {
            const response = await api.put(`/parents/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating parent:', error);
            throw error;
        }
    }
};
