import express from "express";
import { getSchedule, getEventBySlug } from "../services/scheduleService.js";

const router = express.Router();

/**
 * GET /api/schedule
 * Returns full schedule (calendar view)
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

/**
 * GET /api/schedule/:slug
 * Returns single event detail
 */
router.get("/:slug", async (req, res) => {
  try {
    const event = await getEventBySlug(req.params.slug);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load event" });
  }
});

export default router;
