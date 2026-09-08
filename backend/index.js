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

import ConnectDB from "./src/Config/db.js";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

ConnectDB();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 👈 YE LINE MISSING THI: Browser ko uploads folder expose karo inline PDF display ke sath
// server.js ke andar purani static line hatao aur yeh likho:
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
app.use("/api/ai", aiRouter);

app.get("/", (req, res) => {
  res.send("Server is running ...");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});