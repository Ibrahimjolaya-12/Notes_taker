import Subject from "../Models/Subject.model.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { User } from "../Models/Auth.model.js";

// 1. Create Subject Folder
export const createSubject = async (req, res) => {
  try {
    const { code, name } = req.body;
    const userId =
      req.user?._id || req.user?.id || req.user?.userId || req.user?.uid;

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
      user: userId,
    });

    return res.status(201).json({
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
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get All User Subjects
export const getMySubjects = async (req, res) => {
  try {
    const userId =
      req.user?._id || req.user?.id || req.user?.userId || req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication failed.",
      });
    }

    const subjects = await Subject.find({ user: userId }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ success: true, subjects });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get Single Subject
export const getSingleSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId =
      req.user?._id || req.user?.id || req.user?.userId || req.user?.uid;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User authentication failed." });
    }

    const subject = await Subject.findOne({ _id: id, user: userId });
    if (!subject) {
      return res
        .status(404)
        .json({ success: false, message: "Subject not found." });
    }

    return res.status(200).json({ success: true, subject });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Delete Subject
export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId =
      req.user?._id || req.user?.id || req.user?.userId || req.user?.uid;

    const subject = await Subject.findOneAndDelete({ _id: id, user: userId });
    if (!subject) {
      return res.status(404).json({
        success: false,
        message:
          "Subject not found or you don't have permission to delete it.",
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Subject deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Forgot Password (Link Generate & Send Email)
export const forgotPassword = async (req, res) => {
  let user; // Scope ko try ke bahar define kiya taake catch block crash na kare
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No account found with this email" });
    }

    // 32-bytes ka raw crypto token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Token ko sha256 se hash karke database mein save kiya
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token 15 minutes ke liye valid hoga
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Live URL Fallback
    const frontendUrl =
      process.env.FRONTEND_URL || "https://class-notes-sable.vercel.app";
    const resetUrl = `${frontendUrl}/auth/reset-password/${resetToken}`;

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"ClassNotes Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.5;">
          <h2 style="color: #4f46e5;">Password Reset Request</h2>
          <p>Aapne ClassNotes account ka password reset karne ki request bheji thi. Naya password set karne ke liye neeche diye gaye button par click karein:</p>
          <div style="margin: 25px 0;">
            <a href="${resetUrl}" style="background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="font-size: 13px; color: #64748b;">Yeh link sirf 15 minutes ke liye valid hai. Agar aapne password reset request nahi ki thi, toh is email ko ignore karein.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email successfully.",
    });
  } catch (error) {
    console.error("Nodemailer / Forgot Password Failure:", error.message);

    // Agar email send hone mein error aaye toh clean up karo
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
    }

    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Reset Password (Verify Token & Update Password)
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // Aane wale raw token ko sha256 hash karo taake DB ke token se match ho sake
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

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

    // Token cleanup
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Sirf modified password fields validate hongi taake extra schema validation error na de
    await user.save({ validateModifiedOnly: true });

    return res.status(200).json({
      success: true,
      message: "Password has been successfully updated. You can now login.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};