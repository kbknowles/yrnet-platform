import multer from "multer";
import path from "path";
import fs from "fs";

const IMAGE_DIR = "/uploads/images";

if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, IMAGE_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const slug = req.params.slug;

    if (!slug) {
      return cb(new Error("Athlete slug is required for image upload"));
    }

    if (file.fieldname === "headshot") {
      cb(null, `athlete-${slug}-headshot${ext}`);
    } else if (file.fieldname === "actionPhoto") {
      cb(null, `athlete-${slug}-action${ext}`);
    } else {
      cb(new Error("Invalid image field name"));
    }
  },
});

const uploadImage = multer({
  storage,
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Images only"));
    }
    cb(null, true);
  },
});

export default uploadImage;
