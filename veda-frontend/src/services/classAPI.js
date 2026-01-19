import axios from 'axios';

const API_URL = 'http://localhost:5000/api/classes';

const classAPI = {
    // Get all classes (includes sections)
    getAllClasses: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching classes:', error);
            throw error;
        }
    },

    // Get data for a specific class and section (includes students)
    getClassSectionData: async (classId, sectionId) => {
        try {
            const response = await axios.get(`${API_URL}/${classId}/sections/${sectionId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching class section data:', error);
            throw error;
        }
    }
};

export default classAPI;
