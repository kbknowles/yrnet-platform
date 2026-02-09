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

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const { id } = req.params;
    const dir = path.join("uploads", "announcements", String(id));
    fs.mkdirSync(dir, { recursive: true });
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

router.post("/:id/poster", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imageUrl = `/uploads/announcements/${req.params.id}/${req.file.filename}`;

  res.json({ ok: true, imageUrl });
});

export default router;
