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

    if (req.file) {
      const filePath = req.file.path;
      const isPdf = req.file.mimetype === "application/pdf" || req.file.originalname.endsWith(".pdf");

      if (isPdf) {
        const pdfText = await extractTextFromPDF(filePath);
        if (pdfText && pdfText.trim().length > 0) {
          fileContext = `\n\n--- ATTACHED PDF DOCUMENT CONTENT ---\n${pdfText.slice(0, 5000)}\n--- END DOCUMENT ---\n`;
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

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userFinalPrompt },
      ],
      model: "openai/gpt-oss-20b",
      temperature: 0.3,
      max_completion_tokens: 1024,
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

// 2. Particular Card / Topic PDF Document Summarizer (REAL PDF EXTRACTION)
export const summarizeNotePDF = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note record not found." });
    }

    let extractedText = "";

    // Step A: Agar PDF URL available hai
    if (note.fileUrl) {
      const cleanUrl = note.fileUrl.split("?")[0];
      const fileName = path.basename(cleanUrl);

      // 1. Local disk search
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

      // 2. Remote / Full URL fallback (built-in fetch se buffer fetch karo)
      if (!extractedText && (note.fileUrl.startsWith("http://") || note.fileUrl.startsWith("https://"))) {
        try {
          const response = await fetch(note.fileUrl);
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            const tempFolder = path.join(process.cwd(), "public/temp");
            if (!fs.existsSync(tempFolder)) {
              fs.mkdirSync(tempFolder, { recursive: true });
            }

            const tempFilePath = path.join(tempFolder, `sum_${Date.now()}_${fileName}`);
            fs.writeFileSync(tempFilePath, Buffer.from(arrayBuffer));

            extractedText = await extractTextFromPDF(tempFilePath);

            // Cleanup temp file
            if (fs.existsSync(tempFilePath)) {
              fs.unlinkSync(tempFilePath);
            }
          }
        } catch (dlErr) {
          console.error("Remote PDF Download & Parse Failed:", dlErr.message);
        }
      }
    }

    // Step B: Strict validation - Agar PDF se text na nikle
    if (!extractedText || extractedText.trim().length < 30) {
      if (note.content && note.content.trim().length > 60) {
        extractedText = note.content;
      } else {
        return res.status(400).json({
          success: false,
          message: "Uploaded PDF se text read nahi ho saka (scanned image ho sakti hai ya file path invalid hai).",
        });
      }
    }

    const safeContext = extractedText.slice(0, 6000);

    const promptText = `You are an academic exam assistant. Read the provided study document content carefully and summarize it.

--- ATTACHED PDF DOCUMENT CONTENT ---
${safeContext}
--- END DOCUMENT CONTENT ---

Subject Topic: "${note.title}"
Chapter: "${note.chapter || "General"}"

Output Format (strict Markdown):
- **Document Overview**: 2 lines summarizing what this attached document specifically covers.
- **Core Topics & Key Points**: 3 to 5 high-yield concepts extracted directly from the text above.
- **Important Definitions / Takeaways**: Essential formulas, rules, or exam questions.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional academic summarizer. Always ground your summary directly in the provided document text.",
        },
        {
          role: "user",
          content: promptText,
        },
      ],
      model: "openai/gpt-oss-20b",
      temperature: 0.2,
      max_completion_tokens: 800,
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