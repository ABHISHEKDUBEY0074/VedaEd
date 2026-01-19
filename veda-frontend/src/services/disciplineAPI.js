import axios from 'axios';

const API_URL = 'http://localhost:5000/api/discipline';

const disciplineAPI = {
    getAllIncidents: async () => {
        const response = await axios.get(`${API_URL}`);
        return response.data;
    },

    createIncident: async (data) => {
        const response = await axios.post(`${API_URL}`, data);
        return response.data;
    },

    updateIncident: async (id, data) => {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    deleteIncident: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    }
};

export default disciplineAPI;
