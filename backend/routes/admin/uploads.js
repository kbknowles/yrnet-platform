import express from "express";
import uploadPdf from "../../middleware/uploadPdf.js";
import uploadImage from "../../middleware/uploadImage.js";

const router = express.Router();

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.PUBLIC_API_URL
    : "http://localhost:3001";

/* ---------------------------- */
/* UPLOAD PDF */
/* ---------------------------- */
router.post("/pdf", uploadPdf.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    url: `${API_BASE}/uploads/pdfs/${req.file.filename}`,
  });
});

/* ---------------------------- */
/* UPLOAD IMAGE */
/* ---------------------------- */
router.post("/image", uploadImage.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  res.json({
    url: `${API_BASE}/uploads/images/${req.file.filename}`,
  });
});

export default router;
