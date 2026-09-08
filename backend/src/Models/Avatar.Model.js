import { Schema, model } from "mongoose";

const avatarSchema = new Schema(
  {
    avatarUrl: {
      type: String,
      required: [true, "Avatar URL is required"],
    },
    publicId: {
      type: String, // Cloudinary ki image ID (taake baad mein purani image delete ki ja sake)
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true, // Har user ka sirf ek hi avatar document hoga
      index: true,
    },
  },
  { timestamps: true }
);

const Avatar = model("Avatar", avatarSchema);
export default Avatar;