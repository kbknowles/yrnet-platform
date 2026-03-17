// filepath: backend/middleware/uploadGalleryImage.js

import multer from "multer";
import path from "path";
import fs from "fs";

/*
  Gallery Upload Middleware
  -------------------------------------------------------
  REQUIREMENT:
  - resolveTenant MUST run BEFORE this middleware
  - req.tenant.slug is the single source of truth

  Storage:
  /uploads/tenants/{tenantSlug}/gallery
*/

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tenantSlug = req.tenant?.slug;

    if (!tenantSlug) {
      return cb(new Error("Tenant not resolved for gallery upload"));
    }

    const uploadDir = `/uploads/tenants/${tenantSlug}/gallery`;

    try {
      ensureDir(uploadDir);
      cb(null, uploadDir);
    } catch (err) {
      cb(err);
    }
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const galleryId = req.params.id;

    if (!galleryId) {
      return cb(new Error("Gallery ID is required for image upload"));
    }

    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    cb(null, `gallery-${galleryId}-${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Images only"));
    }
  },
});

export { upload };