import fs from "fs/promises";
import { existsSync } from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const extractTextFromPDF = async (filePath) => {
  try {
    if (!existsSync(filePath)) {
      console.warn(`[PDF Warning] File does not exist at: ${filePath}`);
      return "";
    }

    const dataBuffer = await fs.readFile(filePath);
    const uint8Array = new Uint8Array(dataBuffer);

    const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
    const pdfDocument = await loadingTask.promise;

    let fullText = "";
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += `${pageText} `;
    }

    return fullText.replace(/\s+/g, " ").trim();
  } catch (error) {
    console.error(`[PDF Parse Error] Failed for ${filePath}:`, error.message);
    return "";
  }
};