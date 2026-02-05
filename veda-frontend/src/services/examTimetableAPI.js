import config from '../config';
const API_BASE_URL = `${config.API_BASE_URL}/exam-timetables`;

export const examTimetableAPI = {
    // Get all exam timetables
    getAll: async () => {
        try {
            const response = await fetch(API_BASE_URL);
            const data = await response.json();
            if (!data.success) throw new Error(data.message);
            return data.data;
        } catch (error) {
            console.error('Error fetching exam timetables:', error);
            throw error;
        }
    },

    // Upload new exam timetable
    upload: async (formData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: formData, // FormData handles headers
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.message);
            return data.data;
        } catch (error) {
            console.error('Error uploading exam timetable:', error);
            throw error;
        }
    },

    // Delete exam timetable
    delete: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.message);
            return true;
        } catch (error) {
            console.error('Error deleting exam timetable:', error);
            throw error;
        }
    }
};
