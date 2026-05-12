import api from "./apiClient";

const staffAPI = {
    getLeavePolicy: async () => {
        const response = await api.get("/staff/leave/policy");
        return response.data;
    },
    updateLeavePolicy: async (payload) => {
        const response = await api.put("/staff/leave/policy", payload);
        return response.data;
    },
    getLeaveBalance: async () => {
        const response = await api.get("/staff/leave/balance");
        return response.data;
    },
    cancelApprovedLeave: async (id, payload = {}) => {
        const response = await api.put(`/staff/leave/${id}/cancel`, payload);
        return response.data;
    },
    getAllStaff: async () => {
        const response = await api.get("/staff");
        return response.data;
    },
    getStaffById: async (id) => {
        const response = await api.get(`/staff/${id}`);
        return response.data;
    },
    applyLeave: async (payload) => {
        const response = await api.post("/staff/leave/apply", payload);
        return response.data;
    },
    getMyLeaveRequests: async () => {
        const response = await api.get("/staff/leave/my-requests");
        return response.data;
    },
    updateMyLeaveRequest: async (id, payload) => {
        const response = await api.put(`/staff/leave/my-requests/${id}`, payload);
        return response.data;
    },
};

export default staffAPI;
