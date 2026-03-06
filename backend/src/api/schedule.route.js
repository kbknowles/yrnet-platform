// filepath: backend/routes/schedule.js

import express from "express";
import { getSchedule } from "../services/scheduleService.js";

const router = express.Router({ mergeParams: true });

/**
 * GET /schedule
 * Returns full schedule (list + calendar)
 */
router.get("/", async (req, res) => {
  try {
    const events = await getSchedule();
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load schedule" });
  }
});

export default router;
