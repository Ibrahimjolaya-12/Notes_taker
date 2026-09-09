import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";

const isServerless = process.env.VERCEL || process.env.NODE_ENV === "production";

const uploadDir = isServerless
  ? path.join(os.tmpdir(), "temp")
  : path.join(process.cwd(), "public/temp");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });