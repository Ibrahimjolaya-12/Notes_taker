import express from "express";
import {
  addTodos,
  deleteTodo,
  editTodo,
  getAllTodos,
  viewTodo,
} from "../Controller/Todo.controller.js";
import auth from "../Middlewares/Auth.middleware.js";

const router = express.Router();

router.post("/addTodos", auth, addTodos);
router.get("/getAllTodos", auth, getAllTodos);

// Specific ID Routes
router.get("/:id", auth, viewTodo); // Single Todo View karne ke liye
router.put("/:id", auth, editTodo); // Todo Edit karne ke liye
router.delete("/:id", auth, deleteTodo); // Todo Delete karne ke liye

export default router;