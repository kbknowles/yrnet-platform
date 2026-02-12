import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = "uploads/sponsors";

// Ensure directory exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const cleanName = file.originalname
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\-\.]/g, "")
      .toLowerCase();

    cb(null, Date.now() + "-" + cleanName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;
