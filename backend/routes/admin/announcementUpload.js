// filepath: backend/routes/admin/announcementUploads.js

import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import prisma from "../../prismaClient.mjs";
import { resolveTenant } from "../../middleware/resolveTenant.js";

const router = express.Router({ mergeParams: true });

const UPLOAD_ROOT = process.env.UPLOAD_ROOT || path.resolve("uploads");

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "application/pdf",
];

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const { id, tenantSlug } = req.params;

    if (!id || !tenantSlug) {
      return cb(new Error("Missing tenant or announcement id"));
    }

    const dir = path.join(
      UPLOAD_ROOT,
      "tenants",
      tenantSlug,
      "announcements",
      String(id)
    );

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },

  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `poster${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter(_req, file, cb) {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"));
    }
    cb(null, true);
  },
});

router.post(
  "/:tenantSlug/:id/poster",
  resolveTenant,
  upload.single("file"),
  async (req, res) => {
    try {
      const id = Number(req.params.id);

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