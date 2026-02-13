import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "/uploads/pdfs";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const recordId = req.params.id;

    if (!recordId) {
      return cb(new Error("Record ID is required for PDF upload"));
    }

    cb(null, `document-${recordId}${ext}`);
  },
});

const uploadPdf = multer({
  storage,
  fileFilter: (_, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("PDF files only"));
    }
  },
});

export default uploadPdf;
