import express from "express";
import auth from "../Middlewares/Auth.middleware.js";
import { generateSubjectQuiz } from "../Controller/Quiz.controller.js";


const router = express.Router();

router.post("/generate/:subjectId", auth, generateSubjectQuiz);

export default router;