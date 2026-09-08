import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import Chat from "../Models/Chat.Model.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const fileToGenerativePart = (filePath, mimeType) => {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType,
    },
  };
};

export const askStudyAI = async (req, res) => {
  try {
    const { prompt, subject } = req.body;
    const userId = req.user?._id || req.user?.id || req.user?.userId || req.user?.uid;

    if ((!prompt || !prompt.trim()) && !req.file) {
      return res.status(400).json({ success: false, message: "Prompt or image is required" });
    }

    const systemInstruction = `
      You are an expert AI Study Assistant and Academic Mentor named 'ClassNotes AI'.
      Rules:
      1. Only assist with academic concepts, study notes, assignment research, exam preparation, and analyzing shared notebook photos or diagrams.
      2. If the user asks about entertainment, gaming, gossip, or irrelevant non-academic topics, politely decline and redirect them back to study topics.
      3. For assignment or image analysis queries, explain concepts, structures, and steps clearly.
      4. Keep answers concise, clear, and easy to understand. Use markdown and bullet points.
      5. "Muhammad Ibrahim Tahir" is your developer.
      6. "Main Muhammad Zohaib Shazada" does not the founder or participent in this project.
      ${subject ? `The user is currently studying the subject: ${subject}.` : ""}
    `;

    const contents = [prompt || "Please analyze this study image/note and explain it."];
    let mediaUrl = "";
    let mediaType = "text";

    if (req.file) {
      const imagePart = fileToGenerativePart(req.file.path, req.file.mimetype);
      contents.push(imagePart);
      mediaUrl = `http://localhost:5000/uploads/${req.file.filename}`;
      mediaType = "image";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    const replyText = response.text || "No response generated.";

    if (userId) {
      let chatSession = await Chat.findOne({ user: userId });

      const newUserMessage = {
        sender: "user",
        text: prompt || "[Attached Image]",
        mediaUrl: mediaUrl,
        mediaType: mediaType,
      };

      const newAiMessage = {
        sender: "ai",
        text: replyText,
        mediaType: "text",
      };

      if (!chatSession) {
        await Chat.create({
          user: userId,
          messages: [newUserMessage, newAiMessage],
        });
      } else {
        chatSession.messages.push(newUserMessage, newAiMessage);
        await chatSession.save();
      }
    }

    return res.status(200).json({
      success: true,
      reply: replyText,
    });
  } catch (error) {
    console.error("AI Assistant Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate AI response",
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.user?.userId || req.user?.uid;
    if (!userId) {
      return res.status(200).json({ success: true, messages: [] });
    }

    const chatSession = await Chat.findOne({ user: userId });
    return res.status(200).json({
      success: true,
      messages: chatSession?.messages || [],
    });
  } catch (error) {
    console.error("Get History Error:", error.message);
    return res.status(200).json({ success: true, messages: [] });
  }
};

export const clearChatHistory = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.user?.userId || req.user?.uid;
    if (userId) {
      await Chat.findOneAndDelete({ user: userId });
    }
    return res.status(200).json({ success: true, message: "Chat history cleared" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to clear history" });
  }
};