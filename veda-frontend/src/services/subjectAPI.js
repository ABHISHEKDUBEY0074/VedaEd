import api from './apiClient';

// Fetch all subjects
export const getSubjects = async (params = {}) => {
  try {
    const response = await api.get('/subjects/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    throw error;
  }
};

// Create a new subject
export const createSubject = async (subjectData) => {
  try {
    const response = await api.post('/subjects/', subjectData);
    return response.data;
  } catch (error) {
    console.error('Error creating subject:', error);
    throw error;
  }
};

// Update a subject
export const updateSubject = async (subjectId, subjectData) => {
  try {
    const response = await api.put(`/subjects/${subjectId}`, subjectData);
    return response.data;
  } catch (error) {
    console.error('Error updating subject:', error);
    throw error;
  }
};

// Delete a subject
export const deleteSubject = async (subjectId) => {
  try {
    const response = await api.delete(`/subjects/${subjectId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting subject:', error);
    throw error;
  }
};
