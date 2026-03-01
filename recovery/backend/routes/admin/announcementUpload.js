import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "application/pdf",
];

/* =============================
   STORAGE (RENDER DISK)
   Mounted at: /uploads
============================= */

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const { id } = req.params;

    const dir = `/uploads/announcements/${id}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },

  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();

    // Always overwrite poster file
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

/* =============================
   UPLOAD / REPLACE POSTER
============================= */

router.post("/:id/poster", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = `/uploads/announcements/${req.params.id}/${req.file.filename}`;

    res.json({
      ok: true,
      imageUrl,
    });
  } catch (err) {
    console.error("Poster upload failed", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
