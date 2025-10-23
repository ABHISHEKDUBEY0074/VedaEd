const API_BASE_URL = 'http://localhost:5000/api';

// Student API functions
export const studentAPI = {
  // Get all students
  getAllStudents: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  // Get single student by ID
  getStudent: async (studentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  },

  // Get student statistics
  getStudentStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching student stats:', error);
      throw error;
    }
  }
};
