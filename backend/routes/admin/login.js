// filepath: backend/routes/admin/login.js

import express from "express";

const router = express.Router();

/* -------------------------
   LOGIN (TEMP ADMIN)
------------------------- */
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // basic validation (no guessing, explicit)
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // env validation (prevents silent failures)
    if (
      !process.env.ADMIN_EMAIL ||
      !process.env.ADMIN_PASSWORD ||
      !process.env.ADMIN_SECRET
    ) {
      console.error("ADMIN ENV NOT CONFIGURED");
      return res.status(500).json({ error: "Server not configured" });
    }

    // TEMP ADMIN AUTH
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      return res.json({
        token: process.env.ADMIN_SECRET,
      });
    }

    return res.status(401).json({ error: "Invalid credentials" });
  } catch (err) {
    console.error("ADMIN_LOGIN_ERROR", err);
    return res.status(500).json({ error: "Login failed" });
  }
});

export default router;