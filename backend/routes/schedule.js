// backend/routes/schedule.js

import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

console.log("🔥 SCHEDULE ROUTER LOADED");


/**
 * GET /api/schedule
 * Public schedule list
 */
router.get("/", async (req, res) => {
  const events = await prisma.event.findMany({
    where: { status: "published" },
    orderBy: { startDate: "asc" },
    include: {
      location: true,
      season: true,
    },
  });

  res.json(events);
});

/**
 * GET /api/schedule/:slug
 * Public single event
 */
router.get("/:slug", async (req, res) => {
  const slug = req.params.slug.toLowerCase();

  const event = await prisma.event.findFirst({
    where: {
      slug,
      status: "published",
    },
    include: {
      location: true,
      season: true,
      scheduleItems: {
        orderBy: { date: "asc" },
      },
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
});

export default router;
