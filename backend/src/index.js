import express from "express";
import scheduleRoutes from "./api/schedule.route.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "AHSRA backend running" });
});

// Schedule API
app.use("/api/schedule", scheduleRoutes);

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
