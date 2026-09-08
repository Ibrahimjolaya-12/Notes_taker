import Avatar from "../Models/Avatar.Model.js";
import { v2 as cloudinary } from "cloudinary";
import { uploadOnCloudinary } from "../Utils/Cloudinary.js";
import { User } from "../Models/Auth.model.js";

export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const localFilePath = req.file?.path;

    if (!localFilePath) {
      return res.status(400).json({ success: false, message: "Please select an image!" });
    }

    // 1. Cloudinary par upload karo
    const uploadedResponse = await uploadOnCloudinary(localFilePath);
    if (!uploadedResponse) {
      return res.status(500).json({ success: false, message: "Upload to Cloudinary failed" });
    }

    // 2. Agar purana avatar tha to Cloudinary se clean karo
    const oldAvatar = await Avatar.findOne({ user: userId });
    if (oldAvatar?.publicId) {
      await cloudinary.uploader.destroy(oldAvatar.publicId);
    }

    // 3. One-Liner Upsert: Hai to update, nahi hai to create
    const avatar = await Avatar.findOneAndUpdate(
      { user: userId },
      { 
        avatarUrl: uploadedResponse.secure_url, 
        publicId: uploadedResponse.public_id 
      },
      { new: true, upsert: true } // 👈 Asal magic yeh hai
    );

    return res.status(200).json({
      success: true,
      message: "Avatar saved successfully",
      avatar,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};






export const getMyAvatar = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    // 1. Database mein record dhoondo
    const avatar = await Avatar.findOne({ user: userId });

    // 2. Agar record mil gaya, to uska URL bhej do
    if (avatar) {
      return res.status(200).json({
        success: true,
        avatar: avatar.avatarUrl,
      });
    }

    // 3. Agar record nahi mila (naya user hai), to null bhej do
    return res.status(200).json({
      success: true,
      avatar: null,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const updateSemester = async (req, res) => {
  try {
    const { semester } = req.body;
    if (!semester) {
      return res.status(400).json({ success: false, message: "Semester is required" });
    }

    const userId = req.user?.id || req.user?._id;

    // Naya user create nahi karna, UPDATE karna hai
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { semester },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      semester: updatedUser.semester,
    });
  } catch (error) {
    console.error("SEMESTER UPDATE ERROR:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};