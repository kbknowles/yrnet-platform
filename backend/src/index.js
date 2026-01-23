import express from "express";

const app = express();
const PORT = process.env.PORT || 3001;

// Health check (required for Render)
app.get("/", (req, res) => {
  res.json({ status: "AHSRA backend running" });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
