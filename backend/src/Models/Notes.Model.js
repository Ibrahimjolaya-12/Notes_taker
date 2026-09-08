import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Topic title is required"], // e.g. "Eng"
      trim: true,
    },
    chapter: {
      type: String,
      default: "", // e.g. "Ch. 1 • btn btn"
      trim: true,
    },
    content: {
      type: String,
      default: "", // e.g. "this is chp 1"
    },
    tag: {
      type: String,
      enum: ["mid", "imp", "final", "general"],
      default: "general", // Jo button badges bane hain (mid, imp)
    },
    fileUrl: {
      type: String, // PDF ya document preview ke liye
      default: "",
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true, // 👈 Pata chale yeh note kis subject folder ka hai
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);
export default Note;