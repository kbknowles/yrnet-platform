// filepath: backend/routes/admin/announcementUploads.js

/*
  Announcement Upload Route
  -------------------------------------------------------
  Uploads announcement media using flat tenant structure.

  Media architecture

  /uploads/tenants/{tenantSlug}/announcements/{filename}

  Rules
  • No recordId folders
  • DB stores filename only
  • announcementId is sent in FormData
*/

import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import prisma from "../../prismaClient.mjs";
import { resolveTenant } from "../../middleware/resolveTenant.js";

const router = express.Router({ mergeParams: true });

/*
  Upload root
*/
const UPLOAD_ROOT = process.env.UPLOAD_ROOT || path.resolve("uploads");

/*
  Allowed file types
*/
const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "application/pdf",
];

/*
  Multer storage configuration
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

  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${Date.now()}-poster${ext}`;
    cb(null, filename);
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

      const filename = req.file.filename;

      await prisma.announcement.update({
        where: { id: announcementId },
        data: { imageUrl: filename },
      });

      return res.json({
        ok: true,
        imageUrl: filename,
      });
    } catch (err) {
      console.error("Announcement upload failed", err);
      return res.status(500).json({ error: "Upload failed" });
    }
  }
);

export default router;