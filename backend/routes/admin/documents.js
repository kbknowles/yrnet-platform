// filepath: backend/routes/admin/documents.js

/*
  Documents Upload + CRUD Route
  -------------------------------------------------------
  Handles:
  • PDF uploads
  • Document record creation
  • File replacement
  • File deletion

  Media architecture:
  /uploads/tenants/{tenantSlug}/documents/{filename}

  Rules:
  • resolveTenant MUST run first
  • Uses SAME pattern as announcements (NO env paths)
  • Files stored on Render disk mounted at /uploads
  • DB stores full fileUrl path
*/

import express from "express";
import prisma from "../../prismaClient.mjs";
import { resolveTenant } from "../../middleware/resolveTenant.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router({ mergeParams: true });

/*
  Upload root (STANDARDIZED)
*/
const UPLOAD_ROOT = "/uploads";

/*
  Ensure directory exists
*/
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/*
  Multer storage configuration
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
      "documents"
    );

    ensureDir(dir);
    cb(null, dir);
  },

  filename(req, file, cb) {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

/*
  Multer middleware
  - PDF only
  - Max size: 5MB
*/
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files allowed"));
    }
    cb(null, true);
  },
});

/*
  POST /:tenantSlug/admin/documents/upload
  Upload document file
*/
router.post(
  "/upload",
  resolveTenant,
  upload.single("file"),
  (req, res) => {
    try {
      const tenantSlug = req.tenant.slug;

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileUrl = `/uploads/tenants/${tenantSlug}/documents/${req.file.filename}`;

      return res.json({ fileUrl });
    } catch (err) {
      console.error("Document upload failed", err);
      return res.status(500).json({ error: "Upload failed" });
    }
  }
);

/*
  POST /:tenantSlug/admin/documents
  Create document record
*/
router.post("/", resolveTenant, async (req, res) => {
  try {
    const { title, description, category, fileUrl } = req.body;

    const doc = await prisma.document.create({
      data: {
        tenantId: req.tenantId,
        title,
        description,
        category,
        fileUrl,
      },
    });

    return res.json(doc);
  } catch (err) {
    console.error("Create document failed", err);
    return res.status(500).json({ error: "Failed to create document" });
  }
});

/*
  PUT /:tenantSlug/admin/documents/:id
  Replace file + update metadata
*/
router.put(
  "/:id",
  resolveTenant,
  upload.single("file"),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tenantSlug = req.tenant.slug;

      const existing = await prisma.document.findUnique({
        where: { id },
      });

      if (!existing) {
        return res.status(404).json({ error: "Document not found" });
      }

      let newFileUrl = existing.fileUrl;

      if (req.file) {
        const oldPath = path.join(
          UPLOAD_ROOT,
          existing.fileUrl.replace(/^\/+/, "")
        );

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }

        newFileUrl = `/uploads/tenants/${tenantSlug}/documents/${req.file.filename}`;
      }

      const { title, description, category } = req.body;

      const updated = await prisma.document.update({
        where: { id },
        data: {
          title,
          description,
          category,
          fileUrl: newFileUrl,
        },
      });

      return res.json(updated);
    } catch (err) {
      console.error("Update document failed", err);
      return res.status(500).json({ error: "Update failed" });
    }
  }
);

/*
  DELETE /:tenantSlug/admin/documents/:id
  Delete document + file
*/
router.delete("/:id", resolveTenant, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const existing = await prisma.document.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Document not found" });
    }

    const filePath = path.join(
      UPLOAD_ROOT,
      existing.fileUrl.replace(/^\/+/, "")
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.document.delete({
      where: { id },
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("Delete document failed", err);
    return res.status(500).json({ error: "Delete failed" });
  }
});

/*
  MULTER ERROR HANDLER
*/
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }

  if (err.message === "Only PDF files allowed") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
});

export default router;