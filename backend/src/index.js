import express from "express";
import routes from "./routes/index.js";
import path from "path";

const app = express();

app.use(express.json());

/* -----------------------------
   SERVE UPLOADS (REQUIRED)
----------------------------- */
app.use(
  "/uploads",
  express.static(path.resolve("uploads"))
);

/* -----------------------------
   API ROUTES
----------------------------- */
app.use("/api", routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
  console.log(`Serving uploads from: ${path.resolve("uploads")}`);
});
