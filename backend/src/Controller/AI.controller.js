// import Groq from "groq-sdk";
// import fs from "fs";
// import path from "path";
// import os from "os";
// import Chat from "../Models/Chat.Model.js";
// import Note from "../Models/Notes.Model.js";
// import { extractTextFromPDF } from "../Utils/pdfParser.js";

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// // 1. Study AI Assistant (Text + Image + PDF Document Analysis)
// export const askStudyAI = async (req, res) => {
//   try {
//     const { prompt, subject } = req.body;
//     const userId = req.user?._id || req.user?.id || req.user?.userId || req.user?.uid;

//     if ((!prompt || !prompt.trim()) && !req.file) {
//       return res.status(400).json({ success: false, message: "Prompt or file is required" });
//     }

//     let fileContext = "";
//     let mediaUrl = "";
//     let mediaType = "text";

//     if (req.file) {
//       const filePath = req.file.path;
//       const isPdf = req.file.mimetype === "application/pdf" || req.file.originalname.endsWith(".pdf");

//       if (isPdf) {
//         const pdfText = await extractTextFromPDF(filePath);
//         if (pdfText && pdfText.trim().length > 0) {
//           fileContext = `\n\n--- ATTACHED PDF DOCUMENT CONTENT ---\n${pdfText.slice(0, 5000)}\n--- END DOCUMENT ---\n`;
//         }
//         mediaType = "pdf";
//       } else {
//         mediaType = "image";
//       }

//       mediaUrl = `https://class-notes-backend.vercel.app/uploads/${req.file.filename}`;
//     }

//     const systemInstruction = `
// You are an expert AI Study Assistant and Academic Mentor named 'ClassNotes AI'.
// Rules:
// 1. Only assist with academic concepts, study notes, assignment research, exam preparation, and reading provided PDF notes or documents.
// 2. If document content is provided, prioritize answering directly based on that context.
// 3. Keep answers clear, well-structured, concise, and easy to read. Use Markdown headers and bullet points.
// 4. "Muhammad Ibrahim Tahir" is your developer.
// 5. "Main Muhammad Zohaib Shazada" is not the founder or participant in this project.
// 6. NEVER use Markdown tables (NEVER output pipes '|' or table syntax).
// 7. NEVER use HTML tags like <br>, <b>, or <div>.
// 8. For comparisons or lists, ALWAYS use simple clean bullet points (- or •).
// 9. Keep bold text minimal (only bold the key term at the start of a bullet).
// 10. Use clear, simple, and clean readable spacing between sections.
// 11. Keep the tone concise, student-friendly, and easy to scan.
// ${subject ? `The user is currently studying the subject: ${subject}.` : ""}
//     `.trim();

//     const userFinalPrompt = `${fileContext}${prompt?.trim() || "Please analyze this attached document and provide key takeaways."}`;

//     const chatCompletion = await groq.chat.completions.create({
//       messages: [
//         { role: "system", content: systemInstruction },
//         { role: "user", content: userFinalPrompt },
//       ],
//       model: "openai/gpt-oss-20b",
//       temperature: 0.3,
//       max_completion_tokens: 1024,
//     });

//     const replyText = chatCompletion.choices[0]?.message?.content || "No response generated.";

//     if (userId) {
//       let chatSession = await Chat.findOne({ user: userId });

//       const newUserMessage = {
//         sender: "user",
//         text: prompt?.trim() || (mediaType === "pdf" ? "[Attached PDF Document]" : "[Attached Image]"),
//         mediaUrl: mediaUrl,
//         mediaType: mediaType,
//       };

//       const newAiMessage = {
//         sender: "ai",
//         text: replyText,
//         mediaType: "text",
//       };

//       if (!chatSession) {
//         await Chat.create({
//           user: userId,
//           messages: [newUserMessage, newAiMessage],
//         });
//       } else {
//         chatSession.messages.push(newUserMessage, newAiMessage);
//         await chatSession.save();
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       reply: replyText,
//     });
//   } catch (error) {
//     console.error("AI Assistant Runtime Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to generate AI response",
//     });
//   }
// };

// // 2. Particular Card / Topic PDF Document Summarizer (REAL PDF EXTRACTION)
// export const summarizeNotePDF = async (req, res) => {
//   try {
//     const { noteId } = req.params;

//     const note = await Note.findById(noteId);
//     if (!note) {
//       return res.status(404).json({ success: false, message: "Note record not found." });
//     }

//     let extractedText = "";

//     if (note.fileUrl) {
//       const cleanUrl = note.fileUrl.split("?")[0];
//       const fileName = path.basename(cleanUrl);

//       const possiblePaths = [
//         path.join(os.tmpdir(), "temp", fileName),
//         path.join(process.cwd(), "public/temp", fileName),
//         path.join(process.cwd(), "public/uploads", fileName),
//         path.join(process.cwd(), fileName),
//       ];

//       for (const p of possiblePaths) {
//         if (fs.existsSync(p)) {
//           extractedText = await extractTextFromPDF(p);
//           if (extractedText && extractedText.trim().length > 0) break;
//         }
//       }

//       if (!extractedText && (note.fileUrl.startsWith("http://") || note.fileUrl.startsWith("https://"))) {
//         try {
//           const response = await fetch(note.fileUrl);
//           if (response.ok) {
//             const arrayBuffer = await response.arrayBuffer();
//             const tempFolder = path.join(os.tmpdir(), "temp");
//             if (!fs.existsSync(tempFolder)) {
//               fs.mkdirSync(tempFolder, { recursive: true });
//             }

//             const tempFilePath = path.join(tempFolder, `sum_${Date.now()}_${fileName}`);
//             fs.writeFileSync(tempFilePath, Buffer.from(arrayBuffer));

//             extractedText = await extractTextFromPDF(tempFilePath);

//             if (fs.existsSync(tempFilePath)) {
//               fs.unlinkSync(tempFilePath);
//             }
//           }
//         } catch (dlErr) {
//           console.error("Remote PDF Download & Parse Failed:", dlErr.message);
//         }
//       }
//     }

//     if (!extractedText || extractedText.trim().length < 30) {
//       if (note.content && note.content.trim().length > 60) {
//         extractedText = note.content;
//       } else {
//         return res.status(400).json({
//           success: false,
//           message: "Uploaded PDF se text read nahi ho saka (scanned image ho sakti hai ya file path invalid hai).",
//         });
//       }
//     }

//     const safeContext = extractedText.slice(0, 6000);

//     const promptText = `You are an academic exam assistant. Read the provided study document content carefully and summarize it.

// --- ATTACHED PDF DOCUMENT CONTENT ---
// ${safeContext}
// --- END DOCUMENT CONTENT ---

// Subject Topic: "${note.title}"
// Chapter: "${note.chapter || "General"}"

// Output Format (strict Markdown):
// - **Document Overview**: 2 lines summarizing what this attached document specifically covers.
// - **Core Topics & Key Points**: 3 to 5 high-yield concepts extracted directly from the text above.
// - **Important Definitions / Takeaways**: Essential formulas, rules, or exam questions.`;

//     const chatCompletion = await groq.chat.completions.create({
//       messages: [
//         {
//           role: "system",
//           content: "You are a professional academic summarizer. Always ground your summary directly in the provided document text.",
//         },
//         {
//           role: "user",
//           content: promptText,
//         },
//       ],
//       model: "openai/gpt-oss-20b",
//       temperature: 0.2,
//       max_completion_tokens: 800,
//     });

//     const summary = chatCompletion.choices[0]?.message?.content || "No summary generated.";

//     return res.status(200).json({
//       success: true,
//       summary,
//       topic: note.title,
//     });
//   } catch (error) {
//     console.error("PDF Summary Controller Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: error?.message || "Failed to generate document summary.",
//     });
//   }
// };

// // 3. Chat History
// export const getChatHistory = async (req, res) => {
//   try {
//     const userId = req.user?._id || req.user?.id || req.user?.userId || req.user?.uid;
//     if (!userId) {
//       return res.status(200).json({ success: true, messages: [] });
//     }

//     const chatSession = await Chat.findOne({ user: userId });
//     return res.status(200).json({
//       success: true,
//       messages: chatSession?.messages || [],
//     });
//   } catch (error) {
//     console.error("Get History Error:", error.message);
//     return res.status(200).json({ success: true, messages: [] });
//   }
// };

// // 4. Clear Chat History
// export const clearChatHistory = async (req, res) => {
//   try {
//     const userId = req.user?._id || req.user?.id || req.user?.userId || req.user?.uid;
//     if (userId) {
//       await Chat.findOneAndDelete({ user: userId });
//     }
//     return res.status(200).json({ success: true, message: "Chat history cleared" });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "Failed to clear history" });
//   }
// };


// import Groq from "groq-sdk";
// import Chat from "../Models/Chat.Model.js";
// import Note from "../Models/Notes.Model.js";
// import { extractTextFromPDF } from "../Utils/pdfParser.js";

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// // 1. Study AI Assistant
// export const askStudyAI = async (req, res) => {
//   try {
//     const { prompt, subject } = req.body;
//     const userId = req.user?._id || req.user?.id || req.user?.userId || req.user?.uid;

//     if ((!prompt || !prompt.trim()) && !req.file) {
//       return res.status(400).json({ success: false, message: "Prompt or file is required" });
//     }

//     let fileContext = "";
//     let mediaUrl = "";
//     let mediaType = "text";

//     if (req.file) {
//       const filePath = req.file.path;
//       const isPdf = req.file.mimetype === "application/pdf" || req.file.originalname.endsWith(".pdf");

//       if (isPdf) {
//         const pdfText = await extractTextFromPDF(filePath);
//         if (pdfText && pdfText.trim().length > 0) {
//           fileContext = `\n\n--- ATTACHED PDF DOCUMENT CONTENT ---\n${pdfText.slice(0, 5000)}\n--- END DOCUMENT ---\n`;
//         }
//         mediaType = "pdf";
//       } else {
//         mediaType = "image";
//       }

//       mediaUrl = req.file.path.startsWith("http")
//         ? req.file.path
//         : `https://class-notes-backend.vercel.app/uploads/${req.file.filename}`;
//     }

//     const systemInstruction = `
// You are an expert AI Study Assistant and Academic Mentor named 'ClassNotes AI'.
// Rules:
// 1. Only assist with academic concepts, study notes, assignment research, and exam preparation.
// 2. If document content is provided, prioritize answering directly based on that context.
// 3. NEVER use Markdown tables (NEVER output pipes '|' or table syntax).
// 4. NEVER use HTML tags like <br>, <b>, or <div>.
// 5. For comparisons or lists, ALWAYS use simple clean bullet points (- or •).
// 6. Keep bold text minimal (only bold the key term at the start of a bullet).
// 7. Keep answers clear, well-structured, concise, and easy to read.
// ${subject ? `The user is currently studying the subject: ${subject}.` : ""}
//     `.trim();

//     const userFinalPrompt = `${fileContext}${prompt?.trim() || "Please analyze this attached document and provide key takeaways."}`;

//     const chatCompletion = await groq.chat.completions.create({
//       messages: [
//         { role: "system", content: systemInstruction },
//         { role: "user", content: userFinalPrompt },
//       ],
//       model: "llama-3.3-70b-versatile",
//       temperature: 0.3,
//       max_completion_tokens: 1024,
//     });

//     const replyText = chatCompletion.choices[0]?.message?.content || "No response generated.";

//     if (userId) {
//       let chatSession = await Chat.findOne({ user: userId });

//       const newUserMessage = {
//         sender: "user",
//         text: prompt?.trim() || (mediaType === "pdf" ? "[Attached PDF Document]" : "[Attached Image]"),
//         mediaUrl: mediaUrl,
//         mediaType: mediaType,
//       };

//       const newAiMessage = {
//         sender: "ai",
//         text: replyText,
//         mediaType: "text",
//       };

//       if (!chatSession) {
//         await Chat.create({
//           user: userId,
//           messages: [newUserMessage, newAiMessage],
//         });
//       } else {
//         chatSession.messages.push(newUserMessage, newAiMessage);
//         await chatSession.save();
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       reply: replyText,
//     });
//   } catch (error) {
//     console.error("AI Assistant Runtime Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to generate AI response",
//     });
//   }
// };

// // 2. Particular Card / Topic PDF Document Summarizer
// export const summarizeNotePDF = async (req, res) => {
//   try {
//     const { noteId } = req.params;

//     const note = await Note.findById(noteId);
//     if (!note) {
//       return res.status(404).json({ success: false, message: "Note record not found." });
//     }

//     let extractedText = "";
//     const targetUrl = note.fileUrl || note.driveLink || "";

//     // 1. Agar PDF link maujood hai toh parse karein
//     if (targetUrl && targetUrl.toLowerCase().includes(".pdf")) {
//       extractedText = await extractTextFromPDF(targetUrl);
//     }

//     // 2. Graceful Fallback: Scanned PDF, image, ya text na milne par note context use karein
//     let finalStudyContext = "";

//     if (extractedText && extractedText.trim().length > 30) {
//       finalStudyContext = `--- EXTRACTED DOCUMENT TEXT ---\n${extractedText.slice(0, 7000)}\n--- END DOCUMENT TEXT ---`;
//     } else {
//       // Scanned/Image fallback: metadata aur note content se context banayein
//       const noteMeta = [
//         note.title ? `Topic Title: ${note.title}` : "",
//         note.chapter ? `Chapter: ${note.chapter}` : "",
//         note.topic ? `Core Subject Concept: ${note.topic}` : "",
//         note.content ? `User Provided Notes/Description: ${note.content}` : "",
//         note.tag ? `Priority Tag: ${note.tag}` : "",
//       ]
//         .filter(Boolean)
//         .join("\n");

//       finalStudyContext = `--- NOTE DETAILS (SCANNED / TEXT ATTACHMENT) ---\n${noteMeta}\n--- END NOTE DETAILS ---`;
//     }

//     const promptText = `You are an expert academic tutor. Provide a high-yield study summary for exam preparation based on the material below.

// STRICT FORMATTING RULES:
// - NEVER use Markdown tables (NEVER use '|' pipes).
// - NEVER use HTML tags.
// - Use clean bullet points (- or •) with bold keywords at the beginning.

// Content:
// ${finalStudyContext}

// Summary Structure:
// - **Concept Overview**: 2 concise sentences explaining the topic.
// - **Key Takeaways & Exam Points**: 4 to 6 high-yield bullet points.
// - **Important Definitions / Formulas**: Essential terms students must remember.`;

//     const chatCompletion = await groq.chat.completions.create({
//       messages: [
//         {
//           role: "system",
//           content: "You are a professional academic summarizer. Always output clean, readable bullet points without raw tables or HTML tags.",
//         },
//         {
//           role: "user",
//           content: promptText,
//         },
//       ],
//       model: "llama-3.3-70b-versatile",
//       temperature: 0.3,
//       max_completion_tokens: 800,
//     });

//     const summary = chatCompletion.choices[0]?.message?.content || "Summary could not be generated.";

//     return res.status(200).json({
//       success: true,
//       summary,
//       topic: note.title,
//     });
//   } catch (error) {
//     console.error("PDF Summary Controller Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: error?.message || "Failed to generate document summary.",
//     });
//   }
// };

// // 3. Chat History
// export const getChatHistory = async (req, res) => {
//   try {
//     const userId = req.user?._id || req.user?.id || req.user?.userId || req.user?.uid;
//     if (!userId) {
//       return res.status(200).json({ success: true, messages: [] });
//     }

//     const chatSession = await Chat.findOne({ user: userId });
//     return res.status(200).json({
//       success: true,
//       messages: chatSession?.messages || [],
//     });
//   } catch (error) {
//     return res.status(200).json({ success: true, messages: [] });
//   }
// };

// // 4. Clear Chat History
// export const clearChatHistory = async (req, res) => {
//   try {
//     const userId = req.user?._id || req.user?.id || req.user?.userId || req.user?.uid;
//     if (userId) {
//       await Chat.findOneAndDelete({ user: userId });
//     }
//     return res.status(200).json({ success: true, message: "Chat history cleared" });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "Failed to clear history" });
//   }
// };



import Groq from "groq-sdk";
import Chat from "../Models/Chat.Model.js";
import Note from "../Models/Notes.Model.js";
import { extractTextFromPDF } from "../Utils/pdfParser.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// 1. Study AI Assistant
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

      mediaUrl = req.file.path.startsWith("http")
        ? req.file.path
        : `https://class-notes-backend.vercel.app/uploads/${req.file.filename}`;
    }

    const systemInstruction = `
You are an expert AI Study Assistant and Academic Mentor named 'ClassNotes AI'.
Rules:
1. Only assist with academic concepts, study notes, assignment research, and exam preparation.
2. If document content is provided, prioritize answering directly based on that context.
3. NEVER use Markdown tables (NEVER output pipes '|' or table syntax).
4. NEVER use HTML tags like <br>, <b>, or <div>.
5. For comparisons or lists, ALWAYS use simple clean bullet points (- or •).
6. Keep bold text minimal (only bold the key term at the start of a bullet).
7. Keep answers clear, well-structured, concise, and easy to read.
${subject ? `The user is currently studying the subject: ${subject}.` : ""}
    `.trim();

    const userFinalPrompt = `${fileContext}${prompt?.trim() || "Please analyze this attached document and provide key takeaways."}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userFinalPrompt },
      ],
      model: "llama-3.3-70b-versatile",
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

// 2. Particular Card / Topic PDF Document Summarizer (With Fallback for Scanned PDFs)
export const summarizeNotePDF = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note record not found." });
    }

    let extractedText = "";
    const targetUrl = note.fileUrl || note.driveLink || "";

    // 1. Agar PDF link maujood hai toh extraction attempt karo
    if (targetUrl && targetUrl.toLowerCase().includes(".pdf")) {
      try {
        extractedText = await extractTextFromPDF(targetUrl);
      } catch (e) {
        console.warn("PDF extraction skipped:", e.message);
      }
    }

    // 2. Zero Crash Fallback: Chahe text nikle ya na nikle, note details se summary generate hogi
    let finalStudyContext = "";

    if (extractedText && extractedText.trim().length > 30) {
      finalStudyContext = `--- EXTRACTED DOCUMENT TEXT ---\n${extractedText.slice(0, 7000)}\n--- END DOCUMENT TEXT ---`;
    } else {
      const noteMeta = [
        note.title ? `Topic Title: ${note.title}` : "",
        note.chapter ? `Chapter: ${note.chapter}` : "",
        note.topic ? `Core Concept: ${note.topic}` : "",
        note.content ? `Description: ${note.content}` : "",
        note.tag ? `Tag: ${note.tag}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      finalStudyContext = `--- STUDY NOTE CONTEXT ---\n${noteMeta}\n--- END NOTE CONTEXT ---`;
    }

    const promptText = `You are an expert academic tutor. Provide a high-yield study summary for exam preparation based on the material below.

STRICT FORMATTING RULES:
- NEVER use Markdown tables (NEVER use '|' pipes).
- NEVER use HTML tags.
- Use clean bullet points (- or •) with bold keywords at the beginning.

Content:
${finalStudyContext}

Summary Structure:
- **Concept Overview**: 2 concise sentences explaining the topic.
- **Key Takeaways & Exam Points**: 4 to 6 high-yield bullet points.
- **Important Definitions / Formulas**: Essential terms students must remember.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional academic summarizer. Always output clean, readable bullet points without raw tables or HTML tags.",
        },
        {
          role: "user",
          content: promptText,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_completion_tokens: 800,
    });

    const summary = chatCompletion.choices[0]?.message?.content || "Summary could not be generated.";

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