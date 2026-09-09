import express from "express";
import rateLimit from "express-rate-limit";
import auth from "../Middlewares/Auth.middleware.js";
import { generateSubjectQuiz } from "../Controller/Quiz.controller.js";

const router = express.Router();

// Quiz generation heavy operation hai, is par strict limit zaroori hai
const quizGenerationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: 10, // 15 minute mein maximum 6 quizes generate kar sakega
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // User-based tracking (University / Shared Wi-Fi safe)
    return req.user?._id?.toString() || req.user?.id?.toString() || req.ip;
  },
  message: {
    success: false,
    message: "Aapne quiz generation ki limit exceed kar di hai. Baraye meherbani 15 minute baad dobara try karein.",
  },
});

// Pehle user verify hoga, phir limiter chalega, phir quiz generate hoga
router.post("/generate/:subjectId", auth, quizGenerationLimiter, generateSubjectQuiz);

export default router;