// filepath: backend/middleware/uploadSponsorImage.js

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
      const tenantSlug = req.params?.tenantSlug || req.tenant?.slug;

      if (!tenantSlug) {
        return cb(new Error("Tenant not resolved for sponsor upload"));
      }

      const uploadDir = `/uploads/tenants/${tenantSlug}/sponsors`;

      ensureDir(uploadDir);

      cb(null, uploadDir);
    } catch (err) {
      cb(err);
    }
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sponsorId = req.params.id;

    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    if (!sponsorId) {
      cb(null, `sponsor-${unique}${ext}`);
    } else {
      cb(null, `sponsor-${sponsorId}-${unique}${ext}`);
    }
  },
});

const fileFilter = (_, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;