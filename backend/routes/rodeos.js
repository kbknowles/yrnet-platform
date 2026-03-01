// backend/routes/events.js

import express from "express";
import prisma from "../prismaClient.mjs";

const router = express.Router();

console.log("🔥 EVENTS ROUTER LOADED");


/**
 * GET /api/events
 * Public, published events only
 */
router.get("/", async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : undefined;

  const events = await prisma.event.findMany({
    where: { status: "published" },
    orderBy: { startDate: "asc" },
    take: limit,
    include: {
      location: true,
      season: true,
    },
  });

  res.json(events);
});

/**
 * GET /api/events/:slug
 * Public single event by slug
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
