// filepath: backend/routes/admin/announcementUploads.js

/*
  Announcement Upload Route
  -------------------------------------------------------
  Handles:
  • Image uploads (PNG/JPEG)
  • PDF uploads → converted to PNG automatically

  Media architecture:
  /uploads/tenants/{tenantSlug}/announcements/{filename}

  Rules:
  • resolveTenant MUST run first
  • DB stores filename only
  • PDFs are converted to PNG (no PDFs stored long-term)
*/

import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import prisma from "../../prismaClient.mjs";
import { resolveTenant } from "../../middleware/resolveTenant.js";
import pdf from "pdf-poppler";

const router = express.Router({ mergeParams: true });

/*
  Upload root (Render disk)
*/
const UPLOAD_ROOT = "/uploads";

/*
  Allowed file types
*/
const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "application/pdf",
];

/*
  Ensure directory exists
*/
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/*
  Multer storage
*/
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const tenantSlug = req.tenant?.slug;

    if (!tenantSlug) {
      return cb(new Error("Tenant not resolved"));
    }

    const dir = path.join(
      UPLOAD_ROOT,
      "tenants",
      tenantSlug,
      "announcements"
    );

    ensureDir(dir);

    cb(null, dir);
  },

  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = `${Date.now()}-poster`;
    cb(null, `${base}${ext}`);
  },
});

/*
  Multer middleware
*/
const upload = multer({
  storage,
  fileFilter(_req, file, cb) {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"));
    }
    cb(null, true);
  },
});

/*
  POST /:tenantSlug/admin/announcements/upload
*/
router.post(
  "/",
  resolveTenant,
  upload.single("file"),
  async (req, res) => {
    try {
      const announcementId = Number(req.body?.announcementId);

      if (!announcementId) {
        return res.status(400).json({ error: "Missing announcementId" });
      }

      const announcement = await prisma.announcement.findFirst({
        where: {
          id: announcementId,
          tenantId: req.tenantId,
        },
      });

      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const tenantSlug = req.tenant.slug;
      const uploadDir = path.join(
        UPLOAD_ROOT,
        "tenants",
        tenantSlug,
        "announcements"
      );

      let finalFilename = req.file.filename;
      const filePath = path.join(uploadDir, req.file.filename);

      /*
        PDF → PNG conversion
      */
      if (req.file.mimetype === "application/pdf") {
        const outputBase = `${Date.now()}-poster`;

        const options = {
          format: "png",
          out_dir: uploadDir,
          out_prefix: outputBase,
          page: 1,
        };

        await pdf.convert(filePath, options);

        // Result file: {prefix}-1.png
        finalFilename = `${outputBase}-1.png`;

        // delete original PDF
        fs.unlinkSync(filePath);
      }

      /*
        Save to DB
      */
      await prisma.announcement.update({
        where: { id: announcementId },
        data: { imageUrl: finalFilename },
      });

      return res.json({
        ok: true,
        imageUrl: finalFilename,
      });
    } catch (err) {
      console.error("Announcement upload failed", err);
      return res.status(500).json({ error: "Upload failed" });
    }
  }
);

export default router;