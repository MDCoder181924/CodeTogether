import Message from '../../models/Chat/Message.js';
import Group from '../../models/Group/Group.js';
import { askGemini } from '../../services/geminiService.js';

/**
 * Get message history for a room
 */
export const getChatHistory = async (req, res) => {
  try {
    const { roomCode } = req.params;
    if (!roomCode) {
      return res.status(400).json({ success: false, message: "roomCode is required" });
    }

    const messages = await Message.find({ roomCode: roomCode.toUpperCase() }).sort({ timestamp: 1 });
    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("getChatHistory error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Direct REST endpoint to ask Gemini AI
 */
export const askAIController = async (req, res) => {
  try {
    const { roomCode, prompt, sender = "User", currentCode = "", language = "javascript" } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: "prompt is required" });
    }

    const room = roomCode ? roomCode.toUpperCase() : "GENERAL";

    // 1. Fetch group code & history if roomCode provided
    let activeCode = currentCode;
    let activeLang = language;
    let chatHistory = [];

    if (roomCode) {
      const group = await Group.findOne({ groupCode: room });
      if (group) {
        if (!activeCode) activeCode = group.currentCode;
        if (!activeLang) activeLang = group.language;
      }
      chatHistory = await Message.find({ roomCode: room }).sort({ timestamp: 1 }).limit(20);
    }

    // 2. Save user message to database
    const userMsg = await Message.create({
      roomCode: room,
      sender: sender,
      text: prompt,
      isAI: false,
      timestamp: new Date().toISOString()
    });

    // 3. Ask Gemini
    let aiResponseText = "";
    try {
      aiResponseText = await askGemini({
        prompt,
        chatHistory,
        currentCode: activeCode,
        language: activeLang
      });
    } catch (err) {
      aiResponseText = `⚠️ **Gemini AI Error:** ${err.message || "Failed to contact Gemini service."}`;
    }

    // 4. Save AI message to database
    const aiMsg = await Message.create({
      roomCode: room,
      sender: "Gemini AI",
      text: aiResponseText,
      isAI: true,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      userMessage: userMsg,
      aiMessage: aiMsg
    });
  } catch (error) {
    console.error("askAIController error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
