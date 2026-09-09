import express from "express";
import dotenv from "dotenv";
import dns from "node:dns";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import userRouter from "./src/Routes/Auth.routes.js";
import subjectRouter from "./src/Routes/Subject.routes.js";
import todoRouter from "./src/Routes/Todo.routes.js";
import avatarRouter from "./src/Routes/Avatar.routes.js";
import notesRouter from "./src/Routes/Notes.routes.js";
import aiRouter from "./src/Routes/AI.routes.js";
import quizRouter from "./src/Routes/Quiz.routes.js";
import connectDB from "./src/Config/db.js";

dotenv.config();

// Localhost DNS resolve fix (Vercel par execute nahi hoga)
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

const app = express();
app.set("trust proxy", 1);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database Connection
connectDB();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
      ];
      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "public/temp"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".pdf")) {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline");
      }
    },
  })
);

// Routes
app.use("/api/auth", userRouter);
app.use("/api/subjects", subjectRouter);
app.use("/api/todos", todoRouter);
app.use("/api/avatar", avatarRouter);
app.use("/api/notes", notesRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/ai", aiRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ClassNotes Backend Serverless API is running smoothly!",
  });
});

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;