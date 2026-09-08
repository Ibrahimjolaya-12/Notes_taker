import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    semester: {
      type: String,
      enum:{
        values:[1,2,3,4,5,6,7,8],
        message:"Semester must be required"
      },
    },
  },
  {
    timestamps: true, // 'timestamps' with 's'
  }
);

export const User = model("User", userSchema);