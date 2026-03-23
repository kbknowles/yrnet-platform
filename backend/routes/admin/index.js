// filepath: backend/routes/admin/index.js

import express from "express";
import adminGate from "../../middleware/adminGate.mjs";
import login from "./login.js";

const router = express.Router();

/* -------------------------
   LOGIN (NO GATE)
------------------------- */
router.use("/", login);

/* -------------------------
   PROTECTED ADMIN ROUTES
------------------------- */
router.use(adminGate);

export default router;