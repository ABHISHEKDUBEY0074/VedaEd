import axios from 'axios';
import config from '../config';

const API_BASE_URL = config.API_BASE_URL;

export const parentAPI = {
    getAllParents: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/parents`);
            return response.data;
        } catch (error) {
            console.error('Error fetching parents:', error);
            throw error;
        }
    },
    getParentById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/parents/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching parent:', error);
            throw error;
        }
    },
    updateParent: async (id, data) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/parents/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating parent:', error);
            throw error;
        }
    }
};
