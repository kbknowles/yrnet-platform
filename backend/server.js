// filepath: backend/server.js

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";

const app = express();

const PORT = process.env.PORT || 5000;

/* -----------------------------
   Paths
------------------------------ */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -----------------------------
   Middleware
------------------------------ */

app.use(cors());
app.use(express.json());

/* -----------------------------
   Uploads (Render disk)
------------------------------ */

app.use("/uploads", express.static("/uploads"));

/* -----------------------------
   API Routes
------------------------------ */

app.use("/api", routes);

/* -----------------------------
   Health Check
------------------------------ */

app.get("/", (req, res) => {
  res.json({
    status: "YRNet API running",
  });
});

/* -----------------------------
   Start Server
------------------------------ */

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});