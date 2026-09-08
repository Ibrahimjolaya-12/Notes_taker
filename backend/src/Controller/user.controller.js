import Subject from "../Models/Subject.model.js";

// 1. Create Subject Folder
// user.controller.js ke andar:
export const createSubject = async (req, res) => {
  try {
    const { code, name } = req.body;

    // 👈 'uid' add kar diya (jo tumhare token payload se match karta hai)
    const userId = req.user?._id || req.user?.id || req.user?.userId || req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication failed. No user ID found in token.",
      });
    }

    if (!code || !name) {
      return res.status(400).json({
        success: false,
        message: "Code and Name are required",
      });
    }

    const newSubject = await Subject.create({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      user: userId, // 👈 Ab valid user ID pass hogi
    });

    res.status(201).json({
      success: true,
      message: "Subject folder created successfully",
      subject: newSubject,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Subject code already exists in your shelf.",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMySubjects = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.user?.userId || req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication failed.",
      });
    }

    const subjects = await Subject.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getSingleSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id || req.user?.userId || req.user?.uid;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User authentication failed." });
    }

    const subject = await Subject.findOne({ _id: id, user: userId });
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found." });
    }

    res.status(200).json({ success: true, subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteSubject = async (req, res) => {
  try{
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id || req.user?.userId || req.user?.uid;
    const subject = await Subject.findOneAndDelete({ _id: id, user: userId });
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found or you don't have permission to delete it." });
    }
    res.status(200).json({ success: true, message: "Subject deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};