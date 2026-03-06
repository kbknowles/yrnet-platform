// filepath: backend/routes/admin/uploads.js

import express from "express";
import uploadPdf from "../../middleware/uploadPdf.js";
import uploadImage from "../../middleware/uploadImage.js";

const router = express.Router({ mergeParams: true });

/*
  PUBLIC_API_URL should match your API base domain
  Example (Render):
  PUBLIC_API_URL=https://ahsra-api.onrender.com
*/

const PUBLIC_API_URL =
  process.env.PUBLIC_API_URL || "http://localhost:3001";

/* ---------------------------- */
/* UPLOAD PDF */
/* ---------------------------- */
router.post("/pdf", uploadPdf.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `${PUBLIC_API_URL}/uploads/pdfs/${req.file.filename}`;

    res.json({ url: fileUrl });
  } catch (err) {
    console.error("PDF upload failed", err);
    res.status(500).json({ error: "PDF upload failed" });
  }
});

/* ---------------------------- */
/* UPLOAD IMAGE */
/* ---------------------------- */
router.post("/image", uploadImage.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const fileUrl = `${PUBLIC_API_URL}/uploads/images/${req.file.filename}`;

    res.json({ url: fileUrl });
  } catch (err) {
    console.error("Image upload failed", err);
    res.status(500).json({ error: "Image upload failed" });
  }
});

export default router;