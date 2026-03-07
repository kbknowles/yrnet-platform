// filepath: backend/routes/admin/uploads.js

import express from "express";
import uploadPdf from "../../middleware/uploadPdf.js";
import uploadImage from "../../middleware/uploadImage.js";
import { resolveTenant } from "../../middleware/resolveTenant.js";

const router = express.Router({ mergeParams: true });

const PUBLIC_API_URL =
  process.env.PUBLIC_API_URL || "http://localhost:3001";

/* ---------------------------- */
/* UPLOAD PDF (Tenant Scoped) */
/* POST /api/:tenantSlug/admin/uploads/pdf */
/* ---------------------------- */
router.post(
  "/pdf",
  resolveTenant,
  uploadPdf.single("file"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileUrl = `${PUBLIC_API_URL}/uploads/tenants/${req.tenant.slug}/pdfs/${req.file.filename}`;

      res.json({ url: fileUrl });
    } catch (err) {
      console.error("PDF upload failed", err);
      res.status(500).json({ error: "PDF upload failed" });
    }
  }
);

/* ---------------------------- */
/* UPLOAD IMAGE (Tenant Scoped) */
/* POST /api/:tenantSlug/admin/uploads/image */
/* ---------------------------- */
router.post(
  "/image",
  resolveTenant,
  uploadImage.single("file"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      const isVideo = req.file.mimetype.startsWith("video/");
      const folder = isVideo ? "videos" : "images";

      const fileUrl = `${PUBLIC_API_URL}/uploads/tenants/${req.tenant.slug}/${folder}/${req.file.filename}`;

      res.json({ url: fileUrl });
    } catch (err) {
      console.error("Image upload failed", err);
      res.status(500).json({ error: "Image upload failed" });
    }
  }
);

export default router;