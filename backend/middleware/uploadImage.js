// filepath: backend/middleware/uploadImage.js

/*
  KBDev Engine Media Upload Middleware
  -------------------------------------------------------
  Standardized upload system used across all KBDev verticals

  REQUIREMENT:
  - resolveTenant middleware MUST run before this middleware
  - req.tenant.slug is the single source of truth

  Media Structure

  /uploads/tenants/{tenantSlug}/
      images/
      videos/

  Database stores ONLY filename
*/

import multer from "multer";
import path from "path";
import fs from "fs";

/*
  Ensure directory exists before saving file
*/
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const storage = multer.diskStorage({
  /*
    Determine upload destination
  */
  destination: (req, file, cb) => {
    try {
      const tenantSlug = req.tenant?.slug;

      if (!tenantSlug) {
        return cb(new Error("Tenant not resolved for upload"));
      }

      let uploadPath;

      if (file.mimetype.startsWith("image/")) {
        uploadPath = `/uploads/tenants/${tenantSlug}/images`;
      } else if (
        file.mimetype === "video/mp4" ||
        file.mimetype === "video/quicktime" ||
        file.mimetype === "video/webm"
      ) {
        uploadPath = `/uploads/tenants/${tenantSlug}/videos`;
      } else {
        return cb(new Error("Invalid file type"));
      }

      ensureDir(uploadPath);

      cb(null, uploadPath);
    } catch (err) {
      cb(err);
    }
  },

  /*
    Generate unique filename
  */
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;

    cb(null, uniqueName);
  },
});

/*
  Multer configuration
*/
const uploadImage = multer({
  storage,

  /*
    File type validation
  */
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

  /*
    Max upload size: 50MB
  */
  limits: { fileSize: 50 * 1024 * 1024 },
});

export default uploadImage;