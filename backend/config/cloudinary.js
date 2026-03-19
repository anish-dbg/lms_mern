import { v2 as cloudinary } from 'cloudinary'
import fs from "fs";
import dotenv from "dotenv"

dotenv.config()

// configure once
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (fileBuffer) => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      ).end(fileBuffer);
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default uploadOnCloudinary;