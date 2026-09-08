import express from "express";
import auth from "../Middlewares/Auth.middleware.js";
import { upload } from "../Middlewares/Multer.middleware.js";
import {
  createNotes,
  getNotesBySubject,
  getSingleNote,
  updateNote,
  deleteNote,
} from "../Controller/Notes.controller.js";

const router = express.Router();

// 1. Create note under a subject with optional file upload
router.post("/create/:subjectId", auth, upload.single("file"), createNotes);

// 2. Fetch all notes for a specific subject
router.get("/subject/:subjectId", auth, getNotesBySubject);

// 3. View single note
router.get("/:id", auth, getSingleNote);

// 4. Update note
router.put("/:id", auth, upload.single("file"), updateNote);

// 5. Delete note
router.delete("/:id", auth, deleteNote);

export default router;