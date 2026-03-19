// filepath: backend/routes/admin/documents.js

import express from "express";
import prisma from "../../prismaClient.mjs";
import { resolveTenant } from "../../middleware/resolveTenant.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router({ mergeParams: true });

/*
  STORAGE CONFIG
  -------------------------------------------------------
  Upload path:
  /uploads/tenants/{slug}/documents/
*/

function getUploadPath(tenantSlug) {
  const uploadPath = path.join(
    process.cwd(),
    "uploads",
    "tenants",
    tenantSlug,
    "documents"
  );

  fs.mkdirSync(uploadPath, { recursive: true });
  return uploadPath;
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tenantSlug = req.params.tenantSlug;
    cb(null, getUploadPath(tenantSlug));
  },
  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

/*
  FILE VALIDATION
  -------------------------------------------------------
  - PDF only
  - Max size: 5MB
*/

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf"];
    if (!allowed.includes(file.mimetype)) {
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
      const tenantSlug = req.params.tenantSlug;

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileUrl = `/uploads/tenants/${tenantSlug}/documents/${req.file.filename}`;

      res.json({ fileUrl });
    } catch (err) {
      res.status(500).json({ error: err.message || "Upload failed" });
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

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Failed to create document" });
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
      const tenantSlug = req.params.tenantSlug;

      const existing = await prisma.document.findUnique({
        where: { id },
      });

      if (!existing) {
        return res.status(404).json({ error: "Document not found" });
      }

      let newFileUrl = existing.fileUrl;

      /*
        REPLACE FILE
        -------------------------------------------------------
        Delete old file if new file uploaded
      */
      if (req.file) {
        const oldPath = path.join(process.cwd(), existing.fileUrl);

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

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message || "Update failed" });
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

    /*
      DELETE FILE
    */
    const filePath = path.join(process.cwd(), existing.fileUrl);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.document.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;