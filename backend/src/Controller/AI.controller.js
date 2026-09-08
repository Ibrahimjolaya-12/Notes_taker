import Groq from "groq-sdk";
import fs from "fs";
import path from "path";
import Chat from "../Models/Chat.Model.js";
import Note from "../Models/Notes.Model.js";
import { extractTextFromPDF } from "../Utils/pdfParser.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// 1. Study AI Assistant (Text + Image + PDF Document Analysis)
export const askStudyAI = async (req, res) => {
  try {
    const { prompt, subject } = req.body;
    const userId = req.user?._id || req.user?.id || req.user?.userId || req.user?.uid;

    if ((!prompt || !prompt.trim()) && !req.file) {
      return res.status(400).json({ success: false, message: "Prompt or file is required" });
    }

    let fileContext = "";
    let mediaUrl = "";
    let mediaType = "text";

    // Agar user ne koi file upload ki hai
    if (req.file) {
      const filePath = req.file.path;
      const isPdf = req.file.mimetype === "application/pdf" || req.file.originalname.endsWith(".pdf");

      if (isPdf) {
        // PDF se text extract karo
        const pdfText = await extractTextFromPDF(filePath);
        if (pdfText && pdfText.trim().length > 0) {
          fileContext = `\n\n--- ATTACHED PDF DOCUMENT CONTENT ---\n${pdfText.slice(0, 8000)}\n--- END DOCUMENT ---\n`;
        }
        mediaType = "pdf";
      } else {
        mediaType = "image";
      }

      mediaUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const systemInstruction = `
You are an expert AI Study Assistant and Academic Mentor named 'ClassNotes AI'.
Rules:
1. Only assist with academic concepts, study notes, assignment research, exam preparation, and reading provided PDF notes or documents.
2. If document content is provided, prioritize answering directly based on that context.
3. Keep answers clear, well-structured, concise, and easy to read. Use Markdown headers and bullet points.
4. "Muhammad Ibrahim Tahir" is your developer.
5. "Main Muhammad Zohaib Shazada" is not the founder or participant in this project.
${subject ? `The user is currently studying the subject: ${subject}.` : ""}
    `.trim();

    const userFinalPrompt = `${fileContext}${prompt?.trim() || "Please analyze this attached document and provide key takeaways."}`;

    // Groq API Call
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemInstruction,
        },
        {
          role: "user",
          content: userFinalPrompt,
        },
      ],
      model: "qwen/qwen3.8-27b",
      temperature: 0.2,
    });

    const replyText = chatCompletion.choices[0]?.message?.content || "No response generated.";

    if (userId) {
      let chatSession = await Chat.findOne({ user: userId });

      const newUserMessage = {
        sender: "user",
        text: prompt?.trim() || (mediaType === "pdf" ? "[Attached PDF Document]" : "[Attached Image]"),
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
    console.error("AI Assistant Runtime Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate AI response",
    });
  }
};

// 2. Particular Card / Topic PDF Document Summarizer
export const summarizeNotePDF = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note record not found." });
    }

    let extractedText = "";

    if (note.fileUrl) {
      const cleanUrl = note.fileUrl.split("?")[0];
      const fileName = path.basename(cleanUrl);
      const possiblePaths = [
        path.join(process.cwd(), "public/temp", fileName),
        path.join(process.cwd(), "public/uploads", fileName),
        path.join(process.cwd(), fileName),
      ];

      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          extractedText = await extractTextFromPDF(p);
          if (extractedText && extractedText.trim().length > 0) break;
        }
      }
    }

    const rawContent = (
      extractedText ||
      note.content ||
      note.description ||
      `Study topic: ${note.title}. Chapter: ${note.chapter || "General"}`
    ).trim();

    const safeContext = rawContent.slice(0, 7000);

    const promptText = `Provide an exam-oriented study summary for: "${note.title}".
Context details:
${safeContext}

Output format:
- **Overview**: 2 concise lines explaining the core concept.
- **Key Exam Takeaways**: 3-5 high-yield bullet points.
- **Important Definitions / Formulas**: Essential terms or formulas to remember.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: promptText,
        },
      ],
      model: "qwen/qwen3.8-27b",
      temperature: 0.2,
    });

    const summary = chatCompletion.choices[0]?.message?.content || "No summary generated.";

    return res.status(200).json({
      success: true,
      summary,
      topic: note.title,
    });
  } catch (error) {
    console.error("PDF Summary Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to generate document summary.",
    });
  }
};

// 3. Chat History
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

// 4. Clear Chat History
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