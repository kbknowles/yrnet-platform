// filepath: backend/routes/admin/announcementUploads.js

/*
  Announcement Poster Upload Route
  -------------------------------------------------------
  Handles poster uploads for announcements.

  Media architecture (KBDev Engine standard):

  /uploads/tenants/{tenantSlug}/announcements/{filename}

  Rules:
  • No recordId folders
  • Unique filename generated at upload
  • Database stores filename only
  • Frontend resolves URL using resolveTenantMedia()

  Example saved file:
  /uploads/tenants/ahsra/announcements/1719943321-poster.png
*/

import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import prisma from "../../prismaClient.mjs";
import { resolveTenant } from "../../middleware/resolveTenant.js";

const router = express.Router({ mergeParams: true });

/*
  Upload root directory
*/
const UPLOAD_ROOT = process.env.UPLOAD_ROOT || path.resolve("uploads");

/*
  Allowed MIME types
*/
const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "application/pdf",
];

/*
  Multer storage configuration
  -------------------------------------------------------
  Files are saved to:

  /uploads/tenants/{tenantSlug}/announcements/
*/
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const { tenantSlug } = req.params;

    if (!tenantSlug) {
      return cb(new Error("Missing tenantSlug"));
    }

    const dir = path.join(
      UPLOAD_ROOT,
      "tenants",
      tenantSlug,
      "announcements"
    );

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },

  /*
    Generate unique filename to avoid caching issues
  */
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-poster${ext}`;
    cb(null, uniqueName);
  },
});

/*
  Multer upload middleware
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
  POST /:tenantSlug/:id/poster
  -------------------------------------------------------
  Upload poster image for an announcement.

  Steps:
  1. Resolve tenant
  2. Save file to tenant announcement directory
  3. Store filename in database
*/
router.post(
  "/:tenantSlug/:id/poster",
  resolveTenant,
  upload.single("file"),
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      /*
        Validate announcement belongs to tenant
      */
      const announcement = await prisma.announcement.findFirst({
        where: {
          id,
          tenantId: req.tenantId,
        },
      });

      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      /*
        Store filename in DB
      */
      const filename = req.file.filename;

      await prisma.announcement.update({
        where: { id },
        data: { imageUrl: filename },
      });

      res.json({
        ok: true,
        imageUrl: filename,
      });
    } catch (err) {
      console.error("Poster upload failed", err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

export default router;