import axios from 'axios';
import config from '../config';

const API_URL = `${config.API_BASE_URL}/staff`;

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
