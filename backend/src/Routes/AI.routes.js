import express from "express";
import auth from "../Middlewares/Auth.middleware.js";
import { upload } from "../Middlewares/Multer.middleware.js";
import {
  askStudyAI,
  getChatHistory,
  clearChatHistory,
} from "../Controller/AI.controller.js";

const router = express.Router();

router.post("/ask", auth, upload.single("image"), askStudyAI);
router.get("/history", auth, getChatHistory);
router.delete("/clear", auth, clearChatHistory);

export default router;