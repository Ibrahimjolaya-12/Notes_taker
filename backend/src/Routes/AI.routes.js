import express from "express";
import rateLimit from "express-rate-limit"; // 1. Import karein
import auth from "../Middlewares/Auth.middleware.js";
import { upload } from "../Middlewares/Multer.middleware.js";
import {
  askStudyAI,
  getChatHistory,
  clearChatHistory,
} from "../Controller/AI.controller.js";

const router = express.Router();

// 2. Limiter configure karein (Token abuse rokne ke liye)
const aiAskLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: 15, // 15 minute me maximum 15 prompts allow honge
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Aapne bohot zyada sawal pooch liye hain. Baraye meherbani 15 minute baad dobara try karein.",
  },
});

// 3. Limiter ko middleware ke tor par upload aur controller ke darmiyan ya shuru me pass karein
router.post("/ask", auth, aiAskLimiter, upload.single("image"), askStudyAI);

// In routes par AI tokens waste nahi hote, is liye limiter ki zaroorat nahi
router.get("/history", auth, getChatHistory);
router.delete("/clear", auth, clearChatHistory);

export default router;