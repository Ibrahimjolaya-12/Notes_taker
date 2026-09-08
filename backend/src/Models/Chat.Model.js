import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["user", "ai"], required: true },
  text: { type: String, default: "" },
  mediaUrl: { type: String, default: "" }, // image ya audio ka local path
  mediaType: { type: String, enum: ["image", "audio", "text"], default: "text" },
  createdAt: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    messages: [messageSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);