// filepath: backend/src/index.js

import express from "express";
import cors from "cors";

import routes from "../routes/index.js";

const app = express();
const PORT = process.env.PORT || 3001;

/* -------------------- */
/* MIDDLEWARE (ORDERED) */
/* -------------------- */

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

app.use("/uploads", express.static("uploads"));

/* -------- */
/* ROUTES   */
/* -------- */

app.get("/", (req, res) => {
  res.json({ status: "AHSRA backend running" });
});

app.use("/api", routes);

/* -------- */
/* START    */
/* -------- */

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
