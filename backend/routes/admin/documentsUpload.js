// filepath: backend/routes/documentsUpload.js

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { resolveTenant } from "../middleware/resolveTenant.js";

const router = express.Router({ mergeParams: true });

/*
  STORAGE CONFIG
  -------------------------------------------------------
  Upload path:
  /uploads/tenants/{slug}/documents/
*/

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tenantSlug = req.params.tenantSlug;
    const uploadPath = path.join(
      process.cwd(),
      "uploads",
      "tenants",
      tenantSlug,
      "documents"
    );

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/\s+/g, "-");
    const fileName = `${Date.now()}-${safeName}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

/*
  POST /:tenantSlug/documents/upload
*/
router.post(
  "/upload",
  resolveTenant,
  upload.single("file"),
  (req, res) => {
    try {
      const tenantSlug = req.params.tenantSlug;

      const fileUrl = `/uploads/tenants/${tenantSlug}/documents/${req.file.filename}`;

      res.json({ fileUrl });
    } catch (err) {
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

export default router;