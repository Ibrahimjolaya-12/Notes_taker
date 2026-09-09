// import Groq from "groq-sdk";
// import path from "path";
// import { extractTextFromPDF } from "../Utils/pdfParser.js";
// import Note from "../Models/Notes.Model.js";

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// export const generateSubjectQuiz = async (req, res) => {
//   try {
//     const { subjectId } = req.params;
//     const count = Math.min(Math.max(parseInt(req.body.count, 10) || 5, 1), 15);

//     const notes = await Note.find({ subject: subjectId }).lean();

//     if (!notes || notes.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Please add or upload notes in related subject first",
//       });
//     }

//     const textExtractionPromises = notes.map(async (note) => {
//       let extracted = "";
//       if (note.fileUrl && note.fileUrl.endsWith(".pdf")) {
//         const fileName = path.basename(note.fileUrl);
//         const localPath = path.join(process.cwd(), "public/temp", fileName);
//         extracted = await extractTextFromPDF(localPath);
//       }
//       const fallbackContent = note.content || note.description || "";
//       const header = `--- Topic: ${note.title || note.topic || "Untitled"} ---`;
//       return `${header}\n${extracted || fallbackContent}`;
//     });

//     const extractedChunks = await Promise.all(textExtractionPromises);
//     let combinedText = extractedChunks.join("\n\n").trim();

//     if (combinedText.length < 30) {
//       return res.status(400).json({
//         success: false,
//         message: "Notes mein kafi text nahi hai quiz banane ke liye.",
//       });
//     }

//     const sanitizedContext = combinedText.slice(0, 6000);

//     const chatCompletion = await groq.chat.completions.create({
//       messages: [
//         {
//           role: "system",
//           content: `You are an academic test maker. Return ONLY a valid JSON object with a key "quiz" containing an array of objects.
// Schema:
// {
//   "quiz": [
//     {
//       "question": "Question string",
//       "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
//       "correctAnswer": "Exact string of correct option",
//       "explanation": "Short reasoning"
//     }
//   ]
// }
// Do NOT return markdown backticks. Return raw valid JSON only.`,
//         },
//         {
//           role: "user",
//           content: `Generate exactly ${count} MCQs based on this study content:\n\n${sanitizedContext}`,
//         },
//       ],
//       model: "openai/gpt-oss-120b",
//       temperature: 0.1,
//       max_completion_tokens: 2048,
//       response_format: { type: "json_object" },
//     });

//     let rawOutput = chatCompletion.choices[0]?.message?.content || "{}";
//     rawOutput = rawOutput.replace(/```json/g, "").replace(/```/g, "").trim();

//     let parsedData = {};
//     try {
//       parsedData = JSON.parse(rawOutput);
//     } catch (parseErr) {
//       console.error("Failed to parse Groq response:", rawOutput);
//       return res.status(500).json({
//         success: false,
//         message: "AI response parse nahi ho saka. Dobara try karein.",
//       });
//     }

//     const quizData = Array.isArray(parsedData)
//       ? parsedData
//       : parsedData.quiz || parsedData.questions || [];

//     return res.status(200).json({
//       success: true,
//       count: quizData.length,
//       quiz: quizData,
//     });
//   } catch (error) {
//     console.error("Quiz Controller Runtime Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to generate quiz from notes.",
//     });
//   }
// };



import Groq from "groq-sdk";
import path from "path";
import { extractTextFromPDF } from "../Utils/pdfParser.js";
import Note from "../Models/Notes.Model.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateSubjectQuiz = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const count = Math.min(Math.max(parseInt(req.body.count, 10) || 5, 1), 15);

    const notes = await Note.find({ subject: subjectId }).lean();

    if (!notes || notes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Please add or upload notes in related subject first",
      });
    }

    const textExtractionPromises = notes.map(async (note) => {
      let extracted = "";
      if (note.fileUrl && note.fileUrl.endsWith(".pdf")) {
        const fileName = path.basename(note.fileUrl);
        const localPath = path.join(process.cwd(), "public/temp", fileName);
        extracted = await extractTextFromPDF(localPath);
      }
      const fallbackContent = note.content || note.description || "";
      const header = `--- Topic: ${note.title || note.topic || "Untitled"} ---`;
      return `${header}\n${extracted || fallbackContent}`;
    });

    const extractedChunks = await Promise.all(textExtractionPromises);
    let combinedText = extractedChunks.join("\n\n").trim();

    if (combinedText.length < 30) {
      return res.status(400).json({
        success: false,
        message: "Notes mein kafi text nahi hai quiz banane ke liye.",
      });
    }

    const sanitizedContext = combinedText.slice(0, 6000);

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an academic test maker. Return ONLY a valid JSON object with a key "quiz" containing an array of objects.
Schema:
{
  "quiz": [
    {
      "question": "Question string",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": "Exact string of correct option",
      "explanation": "Short reasoning"
    }
  ]
}
Do NOT return markdown backticks. Return raw valid JSON only.`,
        },
        {
          role: "user",
          content: `Generate exactly ${count} MCQs based on this study content:\n\n${sanitizedContext}`,
        },
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.1,
      max_completion_tokens: 2048,
      response_format: { type: "json_object" },
    });

    let rawOutput = chatCompletion.choices[0]?.message?.content || "{}";
    rawOutput = rawOutput.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsedData = {};
    try {
      parsedData = JSON.parse(rawOutput);
    } catch (parseErr) {
      console.error("Failed to parse Groq response:", rawOutput);
      return res.status(500).json({
        success: false,
        message: "AI response parse nahi ho saka. Dobara try karein.",
      });
    }

    const quizData = Array.isArray(parsedData)
      ? parsedData
      : parsedData.quiz || parsedData.questions || [];

    return res.status(200).json({
      success: true,
      count: quizData.length,
      quiz: quizData,
    });
  } catch (error) {
    console.error("Quiz Controller Runtime Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate quiz from notes.",
    });
  }
};