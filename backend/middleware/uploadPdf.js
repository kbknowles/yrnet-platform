import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/pdfs";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const uploadPdf = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("PDF files only"));
    }
  },
});

export default uploadPdf;
