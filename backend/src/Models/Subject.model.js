import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Subject code is required"],
      trim: true,
      uppercase: true, // e.g. "bio-201" -> "BIO-201"
    },
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Har subject kisi na kisi logged-in user ka hoga
    },
  },
  { timestamps: true }
);

 const Subject = mongoose.model("Subject", subjectSchema);

 export default Subject;