import Subject from "../Models/Subject.model.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { User } from "../Models/Auth.model.js";
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

// 1. FORGOT PASSWORD (Link Generate & Send Email)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Security rule: Agar email nahi bhi milti, response generic rakho taake email leak na ho
      return res.status(404).json({ success: false, message: "No account found with this email" });
    }

    // 32-bytes ka raw unhashed crypto token generate kiya
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Token ko sha256 se hash karke database mein save karo (taake DB leak hone par bhi token safe rahe)
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    
    // Token 15 minutes ke liye valid hoga
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Frontend Reset Password Page ka URL
const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/reset-password/${resetToken}`;
    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password (normal password nahi chalega)
      },
    });

    const mailOptions = {
      from: `"ClassNotes Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Password Reset Request</h2>
          <p>Aapne apna password reset karne ki request bheji thi. Neeche diye gaye button par click karke naya password set karein:</p>
          <a href="${resetUrl}" style="background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">Yeh link sirf 15 minutes ke liye valid hai. Agar aapne yeh request nahi ki, toh is email ko ignore karein.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email successfully.",
    });
  } catch (error) {
    // Agar email send hone mein error aaye, toh DB fields clean karo
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. RESET PASSWORD (Verify Token & Update Password)
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // URL se aane wala raw token
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long." });
    }

    // Aane wale raw token ko dobara sha256 se hash kiya taake DB wale hashed token se match ho
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Check karo token match ho raha hai aur expire nahi hua ($gt: Date.now())
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token. Please request a new link.",
      });
    }

    // Naya password hash karke save karo
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Token fields ko saaf (destroy) karo taake link dobara use na ho sake
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // user.save() ki jagah validateModifiedOnly lagao:
await user.save({ validateModifiedOnly: true });

    return res.status(200).json({
      success: true,
      message: "Password has been successfully updated. You can now login.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};