// filepath: backend/middleware/uploadImage.js

import multer from "multer";
import path from "path";
import fs from "fs";

const imagePath = "/uploads/images";
const videoPath = "/uploads/videos";

[imagePath, videoPath].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (_, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, imagePath);
    } else if (
      file.mimetype === "video/mp4" ||
      file.mimetype === "video/quicktime" ||
      file.mimetype === "video/webm"
    ) {
      cb(null, videoPath);
    } else {
      cb(new Error("Invalid file type"));
    }
  },

  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, uniqueName);
  },
});

const uploadImage = multer({
  storage,
  fileFilter: (_, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "video/mp4" ||
      file.mimetype === "video/quicktime" ||
      file.mimetype === "video/webm"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only images and short videos allowed"));
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 },
});

export default uploadImage;