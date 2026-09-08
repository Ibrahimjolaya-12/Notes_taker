import express from "express";
import auth from "../Middlewares/Auth.middleware.js";
import { getMyAvatar, uploadAvatar, updateSemester } from "../Controller/Avatar.controller.js";
import { upload } from "../Middlewares/Multer.middleware.js";

const router = express.Router();

router.post("/upload", auth, upload.single("avatar"), uploadAvatar);
router.get("/me", auth, getMyAvatar);
router.put("/sem", auth, updateSemester); // 👈 PUT route

export default router;