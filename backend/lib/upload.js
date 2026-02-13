import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "/uploads/gallery";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const galleryId = req.params.id;

    if (!galleryId) {
      return cb(new Error("Gallery ID is required for image upload"));
    }

    cb(null, `gallery-${galleryId}${ext}`);
  },
});

export const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Images only"));
    }
  },
});
