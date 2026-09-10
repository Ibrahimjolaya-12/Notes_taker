// import fs from "fs/promises";
// import { existsSync } from "fs";
// import { createRequire } from "module";

// const require = createRequire(import.meta.url);
// const pdfParse = require("pdf-parse-fork");

// export const extractTextFromPDF = async (filePath) => {
//   try {
//     if (!existsSync(filePath)) {
//       console.warn(`[PDF Warning] File does not exist at: ${filePath}`);
//       return "";
//     }

//     const dataBuffer = await fs.readFile(filePath);
//     const pdfData = await pdfParse(dataBuffer);

//     return (pdfData.text || "").replace(/\s+/g, " ").trim();
//   } catch (error) {
//     console.error(`[PDF Parse Error] Failed for ${filePath}:`, error.message);
//     return "";
//   }
// };

import fs from "fs/promises";
import { existsSync } from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
let pdfParse;
try {
  pdfParse = require("pdf-parse-fork");
} catch {
  pdfParse = require("pdf-parse");
}

export const extractTextFromPDF = async (input) => {
  try {
    let dataBuffer;

    if (Buffer.isBuffer(input)) {
      dataBuffer = input;
    } else if (typeof input === "string") {
      if (input.startsWith("http://") || input.startsWith("https://")) {
        // Direct stream in memory (No disk write)
        const res = await fetch(input);
        if (!res.ok) {
          console.warn(`[PDF Fetch Warning] Failed to fetch remote PDF: ${res.status}`);
          return "";
        }
        const arrayBuffer = await res.arrayBuffer();
        dataBuffer = Buffer.from(arrayBuffer);
      } else if (existsSync(input)) {
        dataBuffer = await fs.readFile(input);
      } else {
        console.warn(`[PDF Warning] File path does not exist: ${input}`);
        return "";
      }
    } else {
      return "";
    }

    const pdfData = await pdfParse(dataBuffer);
    return (pdfData.text || "").replace(/\s+/g, " ").trim();
  } catch (error) {
    console.error(`[PDF Parse Error]:`, error.message);
    return "";
  }
};