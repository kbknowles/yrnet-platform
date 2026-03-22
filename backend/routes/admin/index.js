// filepath: backend/routes/admin/index.js

import express from "express";
import adminGate from "../../middleware/adminGate.mjs";
import login from "./login.js";

const router = express.Router();

router.use(adminGate);

router.use("/login", login);


// example
router.get("/dashboard", (req, res) => {
  res.json({ message: "Admin OK" });
});

export default router;