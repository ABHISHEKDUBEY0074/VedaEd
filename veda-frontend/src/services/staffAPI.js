import axios from 'axios';

const API_URL = 'http://localhost:5000/api/staff';

const staffAPI = {
    getAllStaff: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },
    getStaffById: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    }
};

export default staffAPI;
