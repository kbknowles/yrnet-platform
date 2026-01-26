// backend/routes/schedule.js

import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

/**
 * GET full schedule
 */
router.get("/", async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { status: "published" },
      orderBy: { startDate: "asc" },
      include: {
        location: true,
      },
    });

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to load schedule" });
  }
});

/**
 * GET single event by slug
 */
router.get("/:slug", async (req, res) => {
  try {
    const event = await prisma.event.findFirst({
      where: {
        slug: req.params.slug,
        status: "published",
      },
      include: {
        location: true,
        scheduleItems: true,
        announcements: {
          where: { published: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to load event" });
  }
});

export default router;
