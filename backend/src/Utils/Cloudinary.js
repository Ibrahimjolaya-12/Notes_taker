// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";
// import dotenv from "dotenv";

// dotenv.config();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath) return null;

//     const normalizedPath = localFilePath.replace(/\\/g, "/");

//     // 👈 Force resource_type to "auto" so PDFs and documents are properly supported
//     const response = await cloudinary.uploader.upload(normalizedPath, {
//       resource_type: "auto",
//     });

//     if (fs.existsSync(localFilePath)) {
//       fs.unlinkSync(localFilePath);
//     }
//     return response;
//   } catch (error) {
//     console.error("CLOUDINARY ERROR DETAILS:", error);

//     if (fs.existsSync(localFilePath)) {
//       fs.unlinkSync(localFilePath);
//     }
//     return null;
//   }
// };



import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const normalizedPath = localFilePath.replace(/\\/g, "/");

    // Explicit public delivery options for documents and images
    const response = await cloudinary.uploader.upload(normalizedPath, {
      resource_type: "auto",
      access_mode: "public",
      type: "upload",
      use_filename: true,
      unique_filename: true,
    });

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return response;
  } catch (error) {
    console.error("CLOUDINARY ERROR DETAILS:", error);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};