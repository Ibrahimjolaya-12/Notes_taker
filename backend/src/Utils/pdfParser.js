import fs from "fs/promises";
import { existsSync } from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const extractTextFromPDF = async (filePath) => {
  try {
    if (!existsSync(filePath)) {
      console.warn(`[PDF Warning] File does not exist at: ${filePath}`);
      return "";
    }

    const dataBuffer = await fs.readFile(filePath);
    const pdfData = await pdfParse(dataBuffer);

    return (pdfData.text || "").replace(/\s+/g, " ").trim();
  } catch (error) {
    console.error(`[PDF Parse Error] Failed for ${filePath}:`, error.message);
    return "";
  }
};