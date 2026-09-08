import { Schema, model } from "mongoose";

const todoSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Title is required"],
    },
    location: {
      type: String,
      trim: true,
      required: [true, "Location is required"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Description is required"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due Date is required"],
    },
    status: {
      type: String,
      enum: ["incomplete", "complete"], // Yeh ensure karein ke exact yehi strings hon
      default: "incomplete",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true, // Fast querying for user-specific todos
    },
  },
  {
    timestamps: true,
  },
);

const Todo = model("Todo", todoSchema);

export default Todo;
