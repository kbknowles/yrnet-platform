// filepath: backend/middleware/uploadPdf.js

import multer from "multer";
import path from "path";
import fs from "fs";

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const tenantSlug =   req.params?.tenantSlug || req.tenant?.slug || req.tenantSlug;

      if (!tenantSlug) {
        return cb(new Error("Tenant not resolved for PDF upload"));
      }

      const uploadDir = `/uploads/tenants/${tenantSlug}/pdfs`;

      ensureDir(uploadDir);

      cb(null, uploadDir);
    } catch (err) {
      cb(err);
    }
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const recordId = req.params.id;

    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    if (!recordId) {
      cb(null, `document-${unique}${ext}`);
    } else {
      cb(null, `document-${recordId}-${unique}${ext}`);
    }
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
  limits: { fileSize: 25 * 1024 * 1024 },
});

export default uploadPdf;