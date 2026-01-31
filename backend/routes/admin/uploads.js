// filepath: backend/routes/admin/uploads.js

import express from "express";
import uploadPdf from "../../middleware/uploadPdf.js";

const router = express.Router();

/* ---------------------------- */
/* UPLOAD PDF (BETA – NO AUTH) */
/* ---------------------------- */
router.post(
  "/pdf",
  uploadPdf.single("file"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    res.json({
      url: `/uploads/pdfs/${req.file.filename}`,
    });
  }
);

export default router;
