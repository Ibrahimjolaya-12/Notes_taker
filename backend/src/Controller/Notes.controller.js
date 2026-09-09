// import Note from "../Models/Notes.Model.js";
// import { uploadOnCloudinary } from "../Utils/Cloudinary.js";
// import { v2 as cloudinary } from "cloudinary";
// import path from "path";
// import fs from "fs";
// import os from "os";

// // Safe User ID Extractor
// const extractUserId = (req) => {
//   return (
//     req.user?._id ||
//     req.user?.id ||
//     req.user?.userId ||
//     req.user?.uid ||
//     (typeof req.user === "string" ? req.user : null)
//   );
// };

// // 1. CREATE NOTE
// export const createNotes = async (req, res) => {
//   try {
//     const { title, topic, chapter, tags, content, driveLink } = req.body;

//     if (!title || !title.trim()) {
//       return res.status(400).json({ success: false, message: "Note title is required" });
//     }

//     const userId = extractUserId(req);
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized! User ID missing in token." });
//     }

//     const { subjectId } = req.params;
//     if (!subjectId) {
//       return res.status(400).json({ success: false, message: "Subject ID is required." });
//     }

//     let fileUrl = "";
//     let filePublicId = "";

//     if (req.file && req.file.path) {
//       const uploadResponse = await uploadOnCloudinary(req.file.path);
//       if (uploadResponse) {
//         fileUrl = uploadResponse.secure_url;
//         filePublicId = uploadResponse.public_id;
//       }
//     }

//     const newNote = await Note.create({
//       title: title.trim(),
//       topic: topic ? topic.trim() : "",
//       chapter: chapter ? chapter.trim() : "",
//       tag: tags ? tags.trim() : "general",
//       content: content ? content.trim() : "",
//       driveLink: driveLink ? driveLink.trim() : "",
//       fileUrl: fileUrl,
//       filePublicId: filePublicId,
//       subject: subjectId,
//       user: userId,
//     });

//     return res.status(201).json({ success: true, message: "Note created successfully", note: newNote });
//   } catch (error) {
//     console.error("CREATE NOTE ERROR:", error.message);
//     return res.status(500).json({ success: false, message: error.message || "Failed to create note" });
//   }
// };

// // 2. GET NOTES BY SUBJECT
// export const getNotesBySubject = async (req, res) => {
//   try {
//     const { subjectId } = req.params;
//     const userId = extractUserId(req);

//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized access!" });
//     }

//     const notes = await Note.find({ subject: subjectId, user: userId }).sort({ createdAt: -1 });
//     return res.status(200).json({ success: true, notes });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message || "Failed to fetch notes" });
//   }
// };

// // 3. GET SINGLE NOTE
// export const getSingleNote = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = extractUserId(req);

//     const note = await Note.findOne({ _id: id, user: userId });
//     if (!note) return res.status(404).json({ success: false, message: "Note not found" });

//     return res.status(200).json({ success: true, note });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message || "Failed to get note" });
//   }
// };

// // 4. UPDATE NOTE
// export const updateNote = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = extractUserId(req);

//     const { title, topic, chapter, tags, content, driveLink } = req.body;
//     const existingNote = await Note.findOne({ _id: id, user: userId });
//     if (!existingNote) return res.status(404).json({ success: false, message: "Note not found" });

//     const updateFields = {
//       ...(title && { title: title.trim() }),
//       ...(topic !== undefined && { topic: topic.trim() }),
//       ...(chapter !== undefined && { chapter: chapter.trim() }),
//       ...(tags !== undefined && { tag: tags.trim() }),
//       ...(content !== undefined && { content: content.trim() }),
//       ...(driveLink !== undefined && { driveLink: driveLink.trim() }),
//     };

//     if (req.file && req.file.path) {
//       if (existingNote.filePublicId) {
//         try { await cloudinary.uploader.destroy(existingNote.filePublicId); } catch (e) {}
//       }
//       const uploadResponse = await uploadOnCloudinary(req.file.path);
//       if (uploadResponse) {
//         updateFields.fileUrl = uploadResponse.secure_url;
//         updateFields.filePublicId = uploadResponse.public_id;
//       }
//     }

//     const updatedNote = await Note.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
//     return res.status(200).json({ success: true, message: "Note updated", note: updatedNote });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // 5. DELETE NOTE
// export const deleteNote = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = extractUserId(req);

//     const note = await Note.findOneAndDelete({ _id: id, user: userId });
//     if (!note) return res.status(404).json({ success: false, message: "Note not found" });

//     if (note.filePublicId) {
//       try { await cloudinary.uploader.destroy(note.filePublicId); } catch (e) {}
//     }
//     return res.status(200).json({ success: true, message: "Note deleted" });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // 6. NATIVE INLINE STREAM ROUTE (Bypasses Cloudinary & CORS Blocks Completely)
// export const viewNoteFile = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const note = await Note.findById(id);

//     if (!note || (!note.fileUrl && !note.driveLink)) {
//       return res.status(404).send("Document not attached");
//     }

//     const targetUrl = note.fileUrl || note.driveLink;

//     // A: Local file check
//     const filename = path.basename(targetUrl.split("?")[0]);
//     const possiblePaths = [
//       path.join(process.cwd(), "public/temp", filename),
//       path.join(os.tmpdir(), "temp", filename),
//     ];

//     for (const p of possiblePaths) {
//       if (fs.existsSync(p)) {
//         const isPdf = filename.toLowerCase().endsWith(".pdf");
//         res.setHeader("Content-Type", isPdf ? "application/pdf" : "image/jpeg");
//         res.setHeader("Content-Disposition", "inline");
//         return fs.createReadStream(p).pipe(res);
//       }
//     }

//     // B: Cloudinary / Remote file stream (Node native fetch)
//     if (targetUrl.startsWith("http")) {
//       const isPdf = targetUrl.toLowerCase().includes(".pdf");
//       const response = await fetch(targetUrl);

//       if (!response.ok) {
//         return res.redirect(targetUrl);
//       }

//       const arrayBuffer = await response.arrayBuffer();
//       const buffer = Buffer.from(arrayBuffer);

//       res.setHeader("Content-Type", isPdf ? "application/pdf" : (response.headers.get("content-type") || "application/octet-stream"));
//       res.setHeader("Content-Disposition", "inline");
//       return res.send(buffer);
//     }

//     return res.status(404).send("File not found");
//   } catch (err) {
//     console.error("VIEW FILE STREAM ERROR:", err.message);
//     return res.status(500).send("Unable to render document stream");
//   }
// };





// import Note from "../Models/Notes.Model.js";
// import { uploadOnCloudinary } from "../Utils/Cloudinary.js";
// import { v2 as cloudinary } from "cloudinary";

// // Safe User ID Extractor
// const extractUserId = (req) => {
//   return (
//     req.user?._id ||
//     req.user?.id ||
//     req.user?.userId ||
//     req.user?.uid ||
//     (typeof req.user === "string" ? req.user : null)
//   );
// };

// // 1. CREATE NOTE
// export const createNotes = async (req, res) => {
//   try {
//     const { title, topic, chapter, tags, content, driveLink } = req.body;

//     if (!title || !title.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Note title is required",
//       });
//     }

//     const userId = extractUserId(req);
//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized! User ID missing in token.",
//       });
//     }

//     const { subjectId } = req.params;
//     if (!subjectId) {
//       return res.status(400).json({
//         success: false,
//         message: "Subject ID is required in URL parameters.",
//       });
//     }

//     let fileUrl = "";
//     let filePublicId = "";

//     if (req.file && req.file.path) {
//       const uploadResponse = await uploadOnCloudinary(req.file.path);
//       if (uploadResponse) {
//         fileUrl = uploadResponse.secure_url;
//         filePublicId = uploadResponse.public_id;
//       }
//     }

//     const newNote = await Note.create({
//       title: title.trim(),
//       topic: topic ? topic.trim() : "",
//       chapter: chapter ? chapter.trim() : "",
//       tag: tags ? tags.trim() : "general",
//       content: content ? content.trim() : "",
//       driveLink: driveLink ? driveLink.trim() : "",
//       fileUrl: fileUrl,
//       filePublicId: filePublicId,
//       subject: subjectId,
//       user: userId,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Note created successfully",
//       note: newNote,
//     });
//   } catch (error) {
//     console.error("CREATE NOTE ERROR:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to create note",
//     });
//   }
// };

// // 2. GET NOTES BY SUBJECT
// export const getNotesBySubject = async (req, res) => {
//   try {
//     const { subjectId } = req.params;
//     const userId = extractUserId(req);

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized access! User identification failed.",
//       });
//     }

//     const notes = await Note.find({ subject: subjectId, user: userId }).sort({
//       createdAt: -1,
//     });

//     return res.status(200).json({
//       success: true,
//       notes,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to fetch notes",
//     });
//   }
// };

// // 3. GET SINGLE NOTE
// export const getSingleNote = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = extractUserId(req);

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized! User ID missing in token.",
//       });
//     }

//     const note = await Note.findOne({ _id: id, user: userId });
//     if (!note) {
//       return res.status(404).json({
//         success: false,
//         message: "Note not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       note,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to get note",
//     });
//   }
// };

// // 4. UPDATE NOTE (PUT)
// export const updateNote = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = extractUserId(req);

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized! User ID missing in token.",
//       });
//     }

//     const { title, topic, chapter, tags, content, driveLink } = req.body;

//     const existingNote = await Note.findOne({ _id: id, user: userId });
//     if (!existingNote) {
//       return res.status(404).json({
//         success: false,
//         message: "Note not found or you don't have permission to update it",
//       });
//     }

//     const updateFields = {
//       ...(title && { title: title.trim() }),
//       ...(topic !== undefined && { topic: topic.trim() }),
//       ...(chapter !== undefined && { chapter: chapter.trim() }),
//       ...(tags !== undefined && { tag: tags.trim() }),
//       ...(content !== undefined && { content: content.trim() }),
//       ...(driveLink !== undefined && { driveLink: driveLink.trim() }),
//     };

//     if (req.file && req.file.path) {
//       if (existingNote.filePublicId) {
//         try {
//           await cloudinary.uploader.destroy(existingNote.filePublicId);
//         } catch (delErr) {
//           console.error("Cloudinary old file delete error:", delErr.message);
//         }
//       }

//       const uploadResponse = await uploadOnCloudinary(req.file.path);
//       if (uploadResponse) {
//         updateFields.fileUrl = uploadResponse.secure_url;
//         updateFields.filePublicId = uploadResponse.public_id;
//       }
//     }

//     const updatedNote = await Note.findByIdAndUpdate(
//       id,
//       { $set: updateFields },
//       { new: true }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Note updated successfully",
//       note: updatedNote,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to update note",
//     });
//   }
// };

// // 5. DELETE NOTE
// export const deleteNote = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = extractUserId(req);

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized! User ID missing in token.",
//       });
//     }

//     const note = await Note.findOneAndDelete({ _id: id, user: userId });

//     if (!note) {
//       return res.status(404).json({
//         success: false,
//         message: "Note not found or you don't have permission to delete it",
//       });
//     }

//     if (note.filePublicId) {
//       try {
//         await cloudinary.uploader.destroy(note.filePublicId);
//       } catch (delErr) {
//         console.error("Cloudinary file delete error:", delErr.message);
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Note deleted successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to delete note",
//     });
//   }
// };

// // 6. NATIVE STREAM CONTROLLER (Enables selectable PDF engine & direct download)
// export const viewNoteFile = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const note = await Note.findById(id);

//     if (!note || (!note.fileUrl && !note.driveLink)) {
//       return res.status(404).send("Document not attached");
//     }

//     const targetUrl = note.fileUrl || note.driveLink;

//     if (targetUrl.includes("drive.google.com")) {
//       return res.redirect(targetUrl.replace(/\/view.*$/, "/preview"));
//     }

//     if (targetUrl.startsWith("http")) {
//       const response = await fetch(targetUrl);
//       if (!response.ok) {
//         return res.redirect(targetUrl);
//       }

//       const isPdf = targetUrl.toLowerCase().includes(".pdf");
//       const isDownload = req.query.download === "true";
//       const cleanName = `${(note.title || "document").replace(/[^a-zA-Z0-9_-]/g, "_")}${isPdf ? ".pdf" : ".jpg"}`;

//       const arrayBuffer = await response.arrayBuffer();
//       const buffer = Buffer.from(arrayBuffer);

//       res.setHeader("Access-Control-Allow-Origin", "*");
//       res.setHeader(
//         "Content-Type",
//         isPdf ? "application/pdf" : (response.headers.get("content-type") || "image/jpeg")
//       );
//       res.setHeader(
//         "Content-Disposition",
//         isDownload ? `attachment; filename="${cleanName}"` : `inline; filename="${cleanName}"`
//       );

//       return res.send(buffer);
//     }

//     return res.status(404).send("File not found");
//   } catch (err) {
//     console.error("STREAM ERROR:", err.message);
//     return res.status(500).send("Failed to stream document");
//   }
// };



import Note from "../Models/Notes.Model.js";
import { uploadOnCloudinary } from "../Utils/Cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";

const extractUserId = (req) => {
  return (
    req.user?._id ||
    req.user?.id ||
    req.user?.userId ||
    req.user?.uid ||
    (typeof req.user === "string" ? req.user : null)
  );
};

export const createNotes = async (req, res) => {
  try {
    const { title, topic, chapter, tags, content, driveLink } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Note title is required" });
    }
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized! User ID missing." });
    }
    const { subjectId } = req.params;
    if (!subjectId) {
      return res.status(400).json({ success: false, message: "Subject ID is required." });
    }

    let fileUrl = "";
    let filePublicId = "";
    if (req.file && req.file.path) {
      const uploadResponse = await uploadOnCloudinary(req.file.path);
      if (uploadResponse) {
        fileUrl = uploadResponse.secure_url;
        filePublicId = uploadResponse.public_id;
      }
    }

    const newNote = await Note.create({
      title: title.trim(),
      topic: topic ? topic.trim() : "",
      chapter: chapter ? chapter.trim() : "",
      tag: tags ? tags.trim() : "general",
      content: content ? content.trim() : "",
      driveLink: driveLink ? driveLink.trim() : "",
      fileUrl: fileUrl,
      filePublicId: filePublicId,
      subject: subjectId,
      user: userId,
    });

    return res.status(201).json({ success: true, message: "Note created successfully", note: newNote });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getNotesBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const userId = extractUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized access!" });

    const notes = await Note.find({ subject: subjectId, user: userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSingleNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = extractUserId(req);
    const note = await Note.findOne({ _id: id, user: userId });
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    return res.status(200).json({ success: true, note });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = extractUserId(req);
    const { title, topic, chapter, tags, content, driveLink } = req.body;

    const existingNote = await Note.findOne({ _id: id, user: userId });
    if (!existingNote) return res.status(404).json({ success: false, message: "Note not found" });

    const updateFields = {
      ...(title && { title: title.trim() }),
      ...(topic !== undefined && { topic: topic.trim() }),
      ...(chapter !== undefined && { chapter: chapter.trim() }),
      ...(tags !== undefined && { tag: tags.trim() }),
      ...(content !== undefined && { content: content.trim() }),
      ...(driveLink !== undefined && { driveLink: driveLink.trim() }),
    };

    if (req.file && req.file.path) {
      if (existingNote.filePublicId) {
        try { await cloudinary.uploader.destroy(existingNote.filePublicId); } catch (e) {}
      }
      const uploadResponse = await uploadOnCloudinary(req.file.path);
      if (uploadResponse) {
        updateFields.fileUrl = uploadResponse.secure_url;
        updateFields.filePublicId = uploadResponse.public_id;
      }
    }

    const updatedNote = await Note.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
    return res.status(200).json({ success: true, message: "Note updated", note: updatedNote });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = extractUserId(req);
    const note = await Note.findOneAndDelete({ _id: id, user: userId });
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    if (note.filePublicId) {
      try { await cloudinary.uploader.destroy(note.filePublicId); } catch (e) {}
    }
    return res.status(200).json({ success: true, message: "Note deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 👈 NATIVE INLINE STREAM CONTROLLER
export const viewNoteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note || (!note.fileUrl && !note.driveLink)) {
      return res.status(404).send("Document not attached");
    }

    const targetUrl = note.fileUrl || note.driveLink;

    if (targetUrl.includes("drive.google.com")) {
      return res.redirect(targetUrl.replace(/\/view.*$/, "/preview"));
    }

    if (targetUrl.startsWith("http")) {
      const response = await fetch(targetUrl);
      if (!response.ok) return res.redirect(targetUrl);

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const isPdf = targetUrl.toLowerCase().includes(".pdf");
      const isDownload = req.query.download === "true";
      const cleanName = `${(note.title || "document").replace(/[^a-zA-Z0-9_-]/g, "_")}${isPdf ? ".pdf" : ".jpg"}`;

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Content-Type",
        isPdf ? "application/pdf" : (response.headers.get("content-type") || "image/jpeg")
      );
      res.setHeader(
        "Content-Disposition",
        isDownload ? `attachment; filename="${cleanName}"` : `inline; filename="${cleanName}"`
      );

      return res.send(buffer);
    }

    return res.status(404).send("File not found");
  } catch (err) {
    console.error("Stream error:", err.message);
    return res.status(500).send("Unable to stream document");
  }
};