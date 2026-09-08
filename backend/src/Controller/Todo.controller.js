import Todo from "../Models/Todo.Model.js";

// 1. Add new todo
export const addTodos = async (req, res) => {
  try {
    const { title, location, description, dueDate, status } = req.body;

    if (!title || !location || !description || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Title, location, description, and dueDate are required!",
      });
    }

    const userId =
      req.user?.userId || req.user?._id || req.user?.id || req.user?.uid;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized! User ID not found in token.",
      });
    }

    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid due date format provided!",
      });
    }

    const newTodo = await Todo.create({
      title,
      location,
      description,
      status: status ? status.toLowerCase() : "incomplete",
      dueDate: parsedDate,
      user: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Todo created successfully",
      todo: newTodo,
    });
  } catch (error) {
    console.error("ADD TODO ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create todo, internal server error",
    });
  }
};

// 2. Get all todos with search functionality
export const getAllTodos = async (req, res) => {
  try {
    const userId =
      req.user?.userId || req.user?._id || req.user?.id || req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized! User ID not found in token.",
      });
    }

    // 1. Search aur Status dono query se nikaal lo jo URL k last per hoti ha jase /search=exam&status=complete
    const { search, status } = req.query;

    let filter = { user: userId };

    // 2. Status Filter Logic
    if (status && status !== "all") {
      filter.status = status.toLowerCase(); // 'complete' ya 'incomplete'
    }

    // 3. Search Filter Logic ($or ke zariye)
    if (search && search.trim() !== "") {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      filter.$or = [
        { title: searchRegex },
        { location: searchRegex },
        { description: searchRegex },
      ];
    }

    const todos = await Todo.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: todos.length,
      todos,
    });
  } catch (error) {
    console.error("GET TODOS ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch todos",
    });
  }
};

// 3. View single todo
export const viewTodo = async (req, res) => {
  try {
    const userId =
      req.user?.userId || req.user?.uid || req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized! User ID not found in token.",
      });
    }

    const todo = await Todo.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found or you are not authorized to view it!",
      });
    }

    return res.status(200).json({
      success: true,
      todo,
    });
  } catch (error) {
    console.error("VIEW TODO ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch todo details",
    });
  }
};

// 4. Edit todo
export const editTodo = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.user?.userId;
    const { title, description, location, dueDate, status } = req.body;

    const updatedData = {
      title,
      description,
      location,
      dueDate,
      status
    };

    if (status) {
      updatedData.status = status.toLowerCase(); // 'complete' ya 'incomplete' ensure karo
    }

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      updatedData,
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found or unauthorized access",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      todo,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Delete todo
export const deleteTodo = async (req, res) => {
  try {
    const userId =
      req.user?.userId || req.user?._id || req.user?.id || req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized! User ID not found in token.",
      });
    }

    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found or unauthorized access",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (err) {
    console.error("DELETE TODO ERROR:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server error" });
  }
};
