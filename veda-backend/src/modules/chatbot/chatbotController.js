const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.askChatbot = async (req, res) => {
  try {
    const { message, role, userName } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        success: true,
        data: "I'm the VedaEd Smart Assistant! I'm currently in 'offline mode' because my API key hasn't been configured in the backend yet. Please tell my developer to add the GEMINI_API_KEY to the .env file!",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: `You are the VedaEd Smart Assistant, a highly intelligent and helpful AI assistant for VedaEd, a comprehensive School Management System (SMS). 
        Your goal is to assist students, teachers, parents, and school administrators.
        
        Guidelines:
        1. Tone: Maintain a professional, empathetic, and academic tone.
        2. Identity: You are part of the VedaEd ecosystem.
        3. Scope: You help with questions about school schedules, attendance, assignments, and general school policies.
        4. Security: Never disclose sensitive data unless verified.
        5. Current User: You are talking to ${userName || 'a user'} who has the role of ${role || 'guest'}.
        
        Keep your responses concise and formatted using Markdown if needed.`
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      success: true,
      data: text,
    });
  } catch (error) {
    console.error("Chatbot Controller Error:", error);
    res.status(500).json({
      success: false,
      message: "I'm having trouble thinking right now. Please try again in a moment.",
    });
  }
};
