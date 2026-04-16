import apiClient from "./apiClient";

const chatbotAPI = {
  ask: async (message, role, userName) => {
    try {
      const response = await apiClient.post("/chatbot/ask", {
        message,
        role,
        userName,
      });
      return response.data;
    } catch (error) {
      console.error("Chatbot API Error:", error);
      throw error;
    }
  },
};

export default chatbotAPI;
