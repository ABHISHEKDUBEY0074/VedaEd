import axios from 'axios';

const API_URL = 'http://localhost:5000/api/communication'; // Adjust as needed

const complaintAPI = {
    createComplaint: async (data) => {
        const response = await axios.post(`${API_URL}/complaints`, data);
        return response.data;
    },

    getComplaints: async (params) => {
        const response = await axios.get(`${API_URL}/complaints`, { params });
        return response.data;
    },

    getUserComplaints: async (userId, userModel, params) => {
        const response = await axios.get(`${API_URL}/complaints/user/${userId}/${userModel}`, { params });
        return response.data;
    },

    getComplaint: async (complaintId, params) => {
        const response = await axios.get(`${API_URL}/complaints/${complaintId}`, { params });
        return response.data;
    },

    updateStatus: async (complaintId, data) => {
        const response = await axios.put(`${API_URL}/complaints/${complaintId}/status`, data);
        return response.data;
    },

    assignComplaint: async (complaintId, data) => {
        const response = await axios.put(`${API_URL}/complaints/${complaintId}/assign`, data);
        return response.data;
    },

    addResponse: async (complaintId, data) => {
        const response = await axios.put(`${API_URL}/complaints/${complaintId}/response`, data);
        return response.data;
    },

    resolveComplaint: async (complaintId, data) => {
        const response = await axios.put(`${API_URL}/complaints/${complaintId}/resolve`, data);
        return response.data;
    },

    deleteComplaint: async (complaintId) => {
        const response = await axios.delete(`${API_URL}/complaints/${complaintId}`);
        return response.data;
    },

    getStats: async () => {
        const response = await axios.get(`${API_URL}/complaints/stats/summary`);
        return response.data;
    }
};

export default complaintAPI;
