import axios from "axios";
import config from "../config";

const API_URL = `${config.API_BASE_URL}/front-office-setup`;

export const getSetups = async (type) => {
    const response = await axios.get(`${API_URL}?type=${type}`);
    return response.data;
};

export const createSetup = async (setupData) => {
    const response = await axios.post(API_URL, setupData);
    return response.data;
};

export const updateSetup = async (id, setupData) => {
    const response = await axios.put(`${API_URL}/${id}`, setupData);
    return response.data;
};

export const deleteSetup = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
