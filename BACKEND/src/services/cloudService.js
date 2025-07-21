import { v2 as cloudinary } from 'cloudinary';
import config from '../config/config.js';
import { Readable } from 'stream'

cloudinary.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.API_KEY,
  api_secret: config.API_SECRET
});

export const uploadFile = (fileBuffer, resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "job-portal", resource_type: resourceType },
      (err, fileData) => {
        if (err || !fileData) {
          return reject(err || new Error("Cloudinary upload failed"));
        }

        resolve({
          asset_id: fileData.asset_id,
          public_id: fileData.public_id,
          url: fileData.secure_url,
          format: fileData.format,
        });
      }
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

export const uploadResumeToCloud = (
  fileBuffer,
  resourceType = "raw", // ✅ Force raw
  originalname = "file.pdf"
) => {
  return new Promise((resolve, reject) => {
    const extension = originalname.split(".").pop();

    const timestamp = Date.now();

    const baseName = originalname
      .replace(/\.[^/.]+$/, "")       // Remove extension
      .replace(/\s+/g, "_")           // Replace spaces
      .replace(/[^a-zA-Z0-9_-]/g, ""); // Remove special characters

    const cleanName = `${baseName}_${timestamp}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "job-portal",
        resource_type: resourceType, // ✅ Always 'raw'
        public_id: cleanName,
        format: extension,
        use_filename: true,
        unique_filename: false,
      },
      (err, fileData) => {
        if (err || !fileData) {
          return reject(err || new Error("Cloudinary upload failed"));
        }

        resolve({
          asset_id: fileData.asset_id,
          public_id: fileData.public_id,
          url: fileData.secure_url,
          format: fileData.format,
        });
      }
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

export const deleteFile = (public_id) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};
