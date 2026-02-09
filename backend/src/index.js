import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import routes from "../routes/index.js";

const app = express();
const PORT = process.env.PORT || 3001;

/* --------------------
   PATH RESOLUTION
-------------------- */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// backend root (one level up from /src)
const BACKEND_ROOT = path.resolve(__dirname, "..");

// uploads folder: /backend/uploads
const UPLOADS_DIR = path.join(BACKEND_ROOT, "uploads");

/* --------------------
   MIDDLEWARE (ORDERED)
-------------------- */

const allowedOrigins = [
  "http://localhost:3000",
  "https://ahsra.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

/* --------------------
   STATIC UPLOADS
-------------------- */

app.use(
  "/uploads",
  express.static(UPLOADS_DIR, {
    setHeaders: (res, filePath) => {
      // Cache images + PDFs safely
      if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=31536000");
      } else if (filePath.endsWith(".png")) {
        res.setHeader("Content-Type", "image/png");
        res.setHeader("Cache-Control", "public, max-age=31536000");
      } else if (filePath.endsWith(".pdf")) {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Cache-Control", "public, max-age=31536000");
      }
    },
  })
);

/* --------------------
   ROUTES
-------------------- */

app.get("/", (_req, res) => {
  res.json({ status: "AHSRA backend running" });
});

app.use("/api", routes);

/* --------------------
   START
-------------------- */

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
  console.log(`Serving uploads from: ${UPLOADS_DIR}`);
});
