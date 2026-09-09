import express from "express";
import rateLimit from "express-rate-limit";
import auth from "../Middlewares/Auth.middleware.js";
import { upload } from "../Middlewares/Multer.middleware.js";
import {
  askStudyAI,
  getChatHistory,
  clearChatHistory,
} from "../Controller/AI.controller.js";

const router = express.Router();

// User ID ke mutabiq dynamic limiter (Hostel/University shared Wi-Fi safe)
const aiAskLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 15 minute mein 20 prompts
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Agar logged in user hai to uski ID se limit kare, warna IP fallback
    return req.user?._id?.toString() || req.user?.id?.toString() || req.ip;
  },
  message: {
    success: false,
    message: "Aapne limit exceed kar di hai. Baraye meherbani 15 minute baad dobara try karein.",
  },
});

// Pehle Auth verify hoga, phir User-ID limit check hogi, phir File upload handle hogi
router.post("/ask", auth, aiAskLimiter, upload.single("image"), askStudyAI);

// History aur Clear routes par limiter ki zaroorat nahi
router.get("/history", auth, getChatHistory);
router.delete("/clear", auth, clearChatHistory);

export default router;