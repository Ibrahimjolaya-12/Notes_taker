import express from "express";
import { createSubject, deleteSubject, getMySubjects, getSingleSubject } from "../Controller/user.controller.js";
import auth from "../Middlewares/Auth.middleware.js"; // Tumhara JWT token verification middleware

const router = express.Router();

// Dono routes protected honge token ke sath
router.post("/create", auth, createSubject);
router.get("/my-subjects", auth, getMySubjects);
router.get("/:id", auth, getSingleSubject);
router.delete("/:id", auth, deleteSubject);

export default router;