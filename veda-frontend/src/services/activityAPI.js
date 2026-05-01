import api from "./apiClient";

const API_URL = "/activities";

export const getAllActivities = async () => {
    try {
        const response = await api.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching activities:", error);
        throw error;
    }
};

export const createActivity = async (activityData) => {
    try {
        const response = await api.post(API_URL, activityData);
        return response.data;
    } catch (error) {
        console.error("Error creating activity:", error);
        throw error;
    }
};

export const updateActivity = async (id, activityData) => {
    try {
        const response = await api.put(`${API_URL}/${id}`, activityData);
        return response.data;
    } catch (error) {
        console.error("Error updating activity:", error);
        throw error;
    }
};

export const deleteActivity = async (id) => {
    try {
        const response = await api.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting activity:", error);
        throw error;
    }
};

export const getTeacherActivityScope = async () => {
    try {
        const response = await api.get(`${API_URL}/teacher-scope`);
        return response.data;
    } catch (error) {
        console.error("Error fetching teacher activity scope:", error);
        throw error;
    }
};
