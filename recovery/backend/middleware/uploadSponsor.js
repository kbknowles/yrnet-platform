import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = "/uploads/sponsors";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sponsorId = req.params.id;

    if (!sponsorId) {
      return cb(new Error("Sponsor ID is required for image upload"));
    }

    cb(null, `sponsor-${sponsorId}${ext}`);
  },
});

const fileFilter = (_, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
