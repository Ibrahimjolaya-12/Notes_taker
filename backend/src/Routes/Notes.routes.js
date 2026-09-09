// import express from "express";
// import auth from "../Middlewares/Auth.middleware.js";
// import { upload } from "../Middlewares/Multer.middleware.js";
// import {
//   createNotes,
//   getNotesBySubject,
//   getSingleNote,
//   updateNote,
//   deleteNote,
// } from "../Controller/Notes.controller.js";
// import { summarizeNotePDF } from "../Controller/AI.controller.js";

// const router = express.Router();

// // 1. Create note under a subject with optional file upload
// router.post("/create/:subjectId", auth, upload.single("file"), createNotes);

// // 2. Fetch all notes for a specific subject
// router.get("/subject/:subjectId", auth, getNotesBySubject);

// // 3. View single note
// router.get("/:id", auth, getSingleNote);

// // 4. Update note
// router.put("/:id", auth, upload.single("file"), updateNote);

// // 5. Delete note
// router.delete("/:id", auth, deleteNote);



// // individual topic ki summery


// router.post("/summarize-pdf/:noteId", auth, summarizeNotePDF);

// export default router;


// import express from "express";
// import auth from "../Middlewares/Auth.middleware.js";
// import { upload } from "../Middlewares/Multer.middleware.js";
// import {
//   createNotes,
//   getNotesBySubject,
//   getSingleNote,
//   updateNote,
//   deleteNote,
//   viewNoteFile,
// } from "../Controller/Notes.controller.js";
// import { summarizeNotePDF } from "../Controller/AI.controller.js";

// const router = express.Router();

// // Public Inline Stream Route (Browser Native PDF View ke liye)
// router.get("/view-file/:id", viewNoteFile);

// // Protected routes
// router.post("/create/:subjectId", auth, upload.single("file"), createNotes);
// router.get("/subject/:subjectId", auth, getNotesBySubject);
// router.get("/:id", auth, getSingleNote);
// router.put("/:id", auth, upload.single("file"), updateNote);
// router.delete("/:id", auth, deleteNote);
// router.post("/summarize-pdf/:noteId", auth, summarizeNotePDF);

// export default router;



import express from "express";
import auth from "../Middlewares/Auth.middleware.js";
import { upload } from "../Middlewares/Multer.middleware.js";
import {
  createNotes,
  getNotesBySubject,
  getSingleNote,
  updateNote,
  deleteNote,
  viewNoteFile, // 👈 Import viewNoteFile
} from "../Controller/Notes.controller.js";
import { summarizeNotePDF } from "../Controller/AI.controller.js";

const router = express.Router();

// 👈 INLINE STREAM ROUTE (Bina auth ke taake iframe direct render kar sake)
router.get("/view-file/:id", viewNoteFile);

// Protected routes
router.post("/create/:subjectId", auth, upload.single("file"), createNotes);
router.get("/subject/:subjectId", auth, getNotesBySubject);
router.get("/:id", auth, getSingleNote);
router.put("/:id", auth, upload.single("file"), updateNote);
router.delete("/:id", auth, deleteNote);
router.post("/summarize-pdf/:noteId", auth, summarizeNotePDF);

export default router;