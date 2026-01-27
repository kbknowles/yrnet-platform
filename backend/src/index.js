// filepath: backend/src/index.js

import express from "express";
import cors from "cors";

import routes from "../routes/index.js";

const app = express();
const PORT = process.env.PORT || 3001;

/* -------------------- */
/* MIDDLEWARE (ORDERED) */
/* -------------------- */

app.use(
  cors({
    origin: "http://localhost:3000",
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
