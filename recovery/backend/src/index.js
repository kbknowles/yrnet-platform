import express from "express";
import cors from "cors";
import routes from "../routes/index.js";

const app = express();

/* -----------------------------
   CORS
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
   SERVE RENDER DISK UPLOADS
   Disk is mounted at /uploads
----------------------------- */
app.use("/uploads", express.static("/uploads"));

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
  console.log(`Serving uploads from: /uploads`);
});
