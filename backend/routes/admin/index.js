// filepath: backend/routes/admin/index.js

import express from "express";
import adminGate from "../../middleware/adminGate.mjs";
import login from "./login.js";

const router = express.Router();

// ✅ LOGIN MUST COME FIRST (no auth required)
router.use("/login", login);

// 🔒 everything below requires admin
router.use(adminGate);

// example
router.get("/dashboard", (req, res) => {
  res.json({ message: "Admin OK" });
});

export default router;