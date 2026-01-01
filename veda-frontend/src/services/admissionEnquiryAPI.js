import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admission-enquiry';

export const getEnquiries = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createEnquiry = async (enquiryData) => {
    const response = await axios.post(API_URL, enquiryData);
    return response.data;
};

export const updateEnquiry = async (id, enquiryData) => {
    const response = await axios.put(`${API_URL}/${id}`, enquiryData);
    return response.data;
};

export const deleteEnquiry = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
