import api from "./apiClient";

const staffAPI = {
    getAllStaff: async () => {
        const response = await api.get("/staff");
        return response.data;
    },
    getStaffById: async (id) => {
        const response = await api.get(`/staff/${id}`);
        return response.data;
    }
};

export default staffAPI;
