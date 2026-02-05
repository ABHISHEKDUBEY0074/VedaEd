import axios from 'axios';
import config from '../config';

const API_BASE_URL = config.API_BASE_URL;

// Fetch all subjects
export const getSubjects = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/subjects/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    throw error;
  }
};

// Create a new subject
export const createSubject = async (subjectData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/subjects/`, subjectData);
    return response.data;
  } catch (error) {
    console.error('Error creating subject:', error);
    throw error;
  }
};

// Update a subject
export const updateSubject = async (subjectId, subjectData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/subjects/${subjectId}`, subjectData);
    return response.data;
  } catch (error) {
    console.error('Error updating subject:', error);
    throw error;
  }
};

// Delete a subject
export const deleteSubject = async (subjectId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/subjects/${subjectId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting subject:', error);
    throw error;
  }
};
