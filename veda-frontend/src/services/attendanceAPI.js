import axios from "axios";
import config from "../config";

const API_URL = `${config.API_BASE_URL}/attendance`;

export const getAttendanceSummary = async () => {
    const response = await axios.get(`${API_URL}/summary`);
    return response.data;
};

export const getRecentAttendance = async () => {
    const response = await axios.get(`${API_URL}/recent`);
    return response.data;
};

export const getWeeklyStats = async () => {
    const response = await axios.get(`${API_URL}/weekly`);
    return response.data;
};

export const markClassAttendance = async (attendanceData) => {
    const response = await axios.post(`${API_URL}/class`, attendanceData);
    return response.data;
};

export const getAttendanceByClass = async (classId, sectionId, date) => {
    const response = await axios.get(`${API_URL}/class/${classId}/${sectionId}/${date}`);
    return response.data;
};
