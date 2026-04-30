import { authFetch } from "./apiClient";

export const examTimetableAPI = {
    // Get all exam timetables
    getAll: async () => {
        try {
            const response = await authFetch(`/exam-timetables`);
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
            const response = await authFetch(`/exam-timetables/upload`, {
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
            const response = await authFetch(`/exam-timetables/${id}`, {
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
