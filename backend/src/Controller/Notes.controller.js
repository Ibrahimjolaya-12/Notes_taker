import Note from "../Models/Notes.Model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function: Local disk se purani file delete karne ke liye
// Notes.controller.js ke top par helper:
const deleteLocalFile = (fileUrl) => {
  if (!fileUrl) return;
  try {
    const filename = path.basename(fileUrl);
    // 👈 public/temp se delete karega
    const filePath = path.join(__dirname, "../../public/temp", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error("Local file cleanup error:", err.message);
  }
};

// 1. CREATE NOTE
export const createNotes = async (req, res) => {
  try {
    const { title, topic, chapter, tags, content, driveLink } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Note title is required",
      });
    }

    const userId = req.user?._id || req.user?.id || req.user?.userId || req.user?.uid;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized! User ID missing in token.",
      });
    }

    const { subjectId } = req.params;
    if (!subjectId) {
      return res.status(400).json({
        success: false,
        message: "Subject ID is required in URL parameters.",
      });
    }

    // Dynamic base URL (Hardcoding avoid karne ke liye)
    let fileUrl = "";
    if (req.file) {
      fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const newNote = await Note.create({
      title: title.trim(),
      topic: topic ? topic.trim() : "",
      chapter: chapter ? chapter.trim() : "",
      tag: tags ? tags.trim() : "general",
      content: content ? content.trim() : "",
      driveLink: driveLink ? driveLink.trim() : "",
      fileUrl: fileUrl,
      subject: subjectId,
      user: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      note: newNote,
    });
  } catch (error) {
    console.error("CREATE NOTE ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create note",
    });
  }
};

// 2. GET NOTES BY SUBJECT
export const getNotesBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const userId = req.user?._id || req.user?.id || req.user?.userId || req.user?.uid;

    const notes = await Note.find({ subject: subjectId, user: userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    console.error("GET NOTES ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch notes",
    });
  }
};

// 3. GET SINGLE NOTE
export const getSingleNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id || req.user?.userId || req.user?.uid;

    const note = await Note.findOne({ _id: id, user: userId });
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get note",
    });
  }
};

// 4. UPDATE NOTE (PUT)
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id || req.user?.userId || req.user?.uid;
    const { title, topic, chapter, tags, content, driveLink } = req.body;

    const existingNote = await Note.findOne({ _id: id, user: userId });
    if (!existingNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found or you don't have permission to update it",
      });
    }

    const updateFields = {
      ...(title && { title: title.trim() }),
      ...(topic !== undefined && { topic: topic.trim() }),
      ...(chapter !== undefined && { chapter: chapter.trim() }),
      ...(tags !== undefined && { tag: tags.trim() }),
      ...(content !== undefined && { content: content.trim() }),
      ...(driveLink !== undefined && { driveLink: driveLink.trim() }),
    };

    // Agar user nayi file bhej raha hai to purani file disk se remove karo
    if (req.file) {
      deleteLocalFile(existingNote.fileUrl);
      updateFields.fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update note",
    });
  }
};

// 5. DELETE NOTE
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id || req.user?.userId || req.user?.uid;

    const note = await Note.findOneAndDelete({ _id: id, user: userId });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found or you don't have permission to delete it",
      });
    }

    // Disk se physical file remove karo taake storage free rahe
    if (note.fileUrl) {
      deleteLocalFile(note.fileUrl);
    }

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete note",
    });
  }
};