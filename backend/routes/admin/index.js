// filepath: backend/routes/admin/index.js

import express from "express";
import adminGate from "../../middleware/adminGate.mjs";

const router = express.Router();

router.use(adminGate);

// example
router.get("/dashboard", (req, res) => {
  res.json({ message: "Admin OK" });
});

export default router;