// filepath: backend/middleware/uploadImage.js

import multer from "multer";
import path from "path";
import fs from "fs";

const rootUploadDir = path.join(process.cwd(), "uploads");
const imageDir = path.join(rootUploadDir, "images");
const videoDir = path.join(rootUploadDir, "videos");

// Ensure directories exist
[imageDir, videoDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const allowedVideoTypes = [
  "video/mp4",
  "video/quicktime", // .mov
  "video/webm",
];

const storage = multer.diskStorage({
  destination: function (_req, file, cb) {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, imageDir);
    } else if (allowedVideoTypes.includes(file.mimetype)) {
      cb(null, videoDir);
    } else {
      cb(new Error("Unsupported file type"));
    }
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, uniqueName);
  },
});

function fileFilter(_req, file, cb) {
  if (
    allowedImageTypes.includes(file.mimetype) ||
    allowedVideoTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images and short videos are allowed"));
  }
}

const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

export default uploadImage;