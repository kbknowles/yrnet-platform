// filepath: backend/src/index.js

import express from "express";
import cors from "cors";
import routes from "../routes/index.js";
import path from "path";

const app = express();

/* -----------------------------
   CORS (REQUIRED)
----------------------------- */
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
    credentials: true,
  })
);

/* -----------------------------
   BODY PARSER
----------------------------- */
app.use(express.json());

/* -----------------------------
   SERVE UPLOADS
----------------------------- */
app.use(
  "/uploads",
  express.static(path.resolve("uploads"))
);

/* -----------------------------
   API ROUTES
----------------------------- */
app.use("/api", routes);

/* -----------------------------
   START SERVER
----------------------------- */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
  console.log(`Serving uploads from: ${path.resolve("uploads")}`);
});
